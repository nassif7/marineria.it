import { useState, useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { useSession } from '@/Providers/SessionProvider'
import { handlePushNotification } from './useNotifications'

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

export async function schedulePushNotification() {
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

export async function registerForPushNotificationsAsync() {
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
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
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
    } catch (e) {
      pushToken = `${e}`
    }
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return pushToken
}

const usePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([])
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)
  const { auth, storedAuthTokens, switchAuth } = useSession()

  useEffect(() => {
    registerForPushNotificationsAsync().then((pushToken) => pushToken && setExpoPushToken(pushToken))

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
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data
      handlePushNotification(data, { activeRole: auth.role, storedAuthTokens, switchAuth })
    })

    return () => responseListener.remove()
  }, [auth.role, storedAuthTokens, switchAuth])

  return { expoPushToken, channels, notification, schedulePushNotification, setExpoPushToken }
}

export default usePushNotification
