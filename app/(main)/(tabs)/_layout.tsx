import { Redirect, Tabs } from 'expo-router'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'
import { AuthTypes } from '@/api/types'
import { Text, View, NavBackButton } from '@/components/ui'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'

import UserProvider from '@/Providers/UserProvider'

// const

export default function ProfileLayout() {
  const { auth, isLoading } = useSession()
  const { token } = auth

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!token) {
    return <Redirect href="/sign-in" />
  }

  const headerStyle = {
    backgroundColor: 'rgb(30 41 59)',
    shadowColor: 'transparent',
    elevation: 0,
  }

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'rgb(234 88 12)',
          tabBarStyle: {
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'rgb(30 41 59)',
            borderTopColor: 'rgb(30 41 59)',
          },
          tabBarLabelStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: true,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <Feather name="home" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobOffers/index"
          options={{
            headerShown: true,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <FontAwesome6 name="anchor" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobOffers/jobOffer"
          options={{
            href: null,
            headerShown: true,
            headerStyle,
            title: '',
            headerLeft: () => <NavBackButton href="/jobOffers" />,
          }}
        />
        <Tabs.Screen
          name="jobOffers/[offerId]"
          options={{
            href: null,
            headerShown: true,
            headerStyle,
            title: '',
            headerLeft: () => <NavBackButton href="/jobOffers" />,
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            headerShown: true,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <Feather name="user" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings/switchUser"
          options={{
            href: null,
            headerShown: true,
            headerStyle,
            title: '',
            headerLeft: (props) => <NavBackButton href="/settings" />,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}
