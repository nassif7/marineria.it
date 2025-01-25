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

  function headerTitle() {
    return (
      <View>
        <Image style={{ width: 200, height: 50 }} source={require('../../../assets/images/marineria_Logo.png')} />
      </View>
    )
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
          name="jobOffers/index"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <FontAwesome6 name="anchor" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobOffers/jobOffer"
          options={{
            sceneStyle: { ...sceneStyle, paddingTop: 0 },
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
            sceneStyle,
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
            sceneStyle,
            headerShown: true,
            headerStyle,
            title: '',
            tabBarIcon: ({ color }) => <Feather name="user" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings/switchUser"
          options={{
            sceneStyle: { ...sceneStyle, paddingTop: 0 },
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
