import { Image } from 'react-native'
import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'
import UserProvider from '@/Providers/UserProvider'
import { Text, View, NavBackButton } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'

// const

export default function ProfileLayout() {
  const { auth, isLoading } = useSession()
  const { token } = auth
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!token) {
    return <Redirect href="/sign-in" />
  }

  const headerStyle = {
    backgroundColor: 'rgb(30 41 59)',
  }

  const sceneStyle = {
    backgroundColor: 'rgb(30 41 59)',
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: insets.top,
  }

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'rgb(234 88 12)',
          tabBarStyle: {
            backgroundColor: 'rgb(30 41 59)',
            borderTopColor: 'rgb(30 41 59)',
            boxShadow: '0px 0px 20px 0px rgba(234,88,12,0.25)',
          },
          tabBarLabelStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <Feather name="home" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobOffers"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <FontAwesome6 name="anchor" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <Feather name="user" size={32} color={color} />,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}
