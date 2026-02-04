import { useState, useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { router } from 'expo-router'

export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Marineria!',
      body: 'There is a job offer for you!',
      data: { id: 'goes here', test: { test1: 'more data' } },
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

    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.

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

const useNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([])
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)

  useEffect(() => {
    registerForPushNotificationsAsync().then((pushToken) => pushToken && setExpoPushToken(pushToken))

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) => setChannels(value ?? []))
    }
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    const responseListener = Notifications.addNotificationResponseReceivedListener(async () => {
      router.replace('/')
    })

    return () => {
      notificationListener.remove()
      responseListener.remove()
    }
  }, [])

  return { expoPushToken, channels, notification, schedulePushNotification, setExpoPushToken }
}

export default useNotification
