import { useState, useEffect } from 'react'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform, Alert, Linking } from 'react-native'
import { useSession } from '@/Providers/SessionProvider'
import { handlePushNotification } from './useNotifications'
import type * as ExpoNotifications from 'expo-notifications'

// expo-notifications' remote-notification support was pulled from Expo Go entirely as of
// SDK 53 — merely importing/requiring the module throws there (confirmed on Android; not
// reliable on iOS either). This file is on basically every screen's require graph via
// RecruiterProvider/CrewProvider, so a static import here crashes the whole app inside Expo
// Go. Load it lazily, only outside Expo Go, and guard every use of it below.
// `executionEnvironment === 'storeClient'` would also match legitimate expo-dev-client
// builds (where this module works fine) — `appOwnership === 'expo'` is the one signal that
// means "actually Expo Go", despite being nominally deprecated in favor of the former.
const isExpoGo = Constants.appOwnership === 'expo'

let Notifications: typeof ExpoNotifications | null = null
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications')
  } catch {
    Notifications = null
  }
}

if (Notifications) {
  // Configure how notifications are handled when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}

export async function schedulePushNotification() {
  if (!Notifications) return
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Marineria!',
      body: 'There is a job offer for you!',
      data: {
        type: 'job_offer', // or 'cv_profile'
        offerId: '123',
        cvId: '456', // only for cv_profile type
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  })
}

// Fixed identifier prefix ("availability-expiry-reminder-0", "-1", …). Scheduling always cancels
// every pending one first, so there's never a stale batch left over after the crew changes their
// availability date. The prefix also matches the old single-notification id from earlier builds.
const AVAILABILITY_REMINDER_ID = 'availability-expiry-reminder'

export async function cancelAvailabilityReminder() {
  if (!Notifications) return
  const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
  await Promise.all(
    scheduled
      .filter((n) => n.identifier.startsWith(AVAILABILITY_REMINDER_ID))
      .map((n) => Notifications!.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
  )
}

// Purely local — each fires on this device at its date/time regardless of whether the app is
// open, no server involvement. `dates` should all be in the future; the caller is responsible
// for working out when (see getAvailabilityReminderDates).
export async function scheduleAvailabilityReminder(dates: Date[], content: { title: string; body: string }) {
  if (!Notifications) return
  let permissions = await Notifications.getPermissionsAsync()
  if (permissions.status !== 'granted' && permissions.canAskAgain) {
    permissions = await Notifications.requestPermissionsAsync()
  }
  if (permissions.status !== 'granted') return
  await cancelAvailabilityReminder()
  await Promise.all(
    dates.map((date, i) =>
      Notifications!.scheduleNotificationAsync({
        identifier: `${AVAILABILITY_REMINDER_ID}-${i}`,
        content,
        trigger: {
          type: Notifications!.SchedulableTriggerInputTypes.DATE,
          date,
        },
      })
    )
  )
}

// `silent` suppresses user-facing alerts — used by the app-launch auto-registration
// effect below, which runs on every mount regardless of whether the user has ever
// opted in and shouldn't nag them; the explicit "enable notifications" toggles pass
// silent: false (the default) so a denied permission is actionable.
export async function registerForPushNotificationsAsync(options: { silent?: boolean } = {}) {
  const { silent = false } = options
  if (!Notifications) return undefined
  let pushToken

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const existing = await Notifications.getPermissionsAsync()
    let finalStatus = existing.status
    let canAskAgain = existing.canAskAgain
    if (existing.status !== 'granted' && existing.canAskAgain) {
      const requested = await Notifications.requestPermissionsAsync()
      finalStatus = requested.status
      canAskAgain = requested.canAskAgain
    }
    if (finalStatus !== 'granted') {
      // Once denied, iOS/Android won't show the system prompt again — the only way
      // back is the OS Settings screen, so send the user there instead of re-asking.
      if (!silent) {
        if (!canAskAgain) {
          Alert.alert(
            'Notifications are disabled',
            'Enable notifications for Marineria in your device Settings to turn this on.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          )
        } else {
          Alert.alert('Failed to get push token for push notification!')
        }
      }
      return
    }

    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
      if (!projectId) {
        throw new Error('Project ID not found')
      }
      pushToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
    } catch {
      pushToken = undefined
    }
  } else if (!silent) {
    Alert.alert('Must use physical device for Push Notifications')
  }

  return pushToken
}

const usePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [channels, setChannels] = useState<ExpoNotifications.NotificationChannel[]>([])
  const [notification, setNotification] = useState<ExpoNotifications.Notification | undefined>(undefined)
  const { auth, storedAuthTokens, switchAuth } = useSession()

  useEffect(() => {
    if (!Notifications) return

    registerForPushNotificationsAsync({ silent: true }).then((pushToken) => pushToken && setExpoPushToken(pushToken))

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []))
    }

    // Notification received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    return () => notificationListener.remove()
  }, [])

  // Re-subscribed whenever the active role/tokens change, so a tapped push is always
  // resolved (and possibly switched) against the account state that's current right now,
  // not whatever was active when the listener was first attached.
  useEffect(() => {
    if (!Notifications) return

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data
      handlePushNotification(data, { activeRole: auth.role, storedAuthTokens, switchAuth })
    })

    return () => responseListener.remove()
  }, [auth.role, storedAuthTokens, switchAuth])

  return { expoPushToken, channels, notification, schedulePushNotification, setExpoPushToken }
}

export default usePushNotification
