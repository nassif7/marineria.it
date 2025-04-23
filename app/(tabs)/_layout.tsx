import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'
import UserProvider from '@/Providers/UserProvider'
import { Text } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'
import { TabBar } from '@/components/ui'

const AppLayout = () => {
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
          tabBarStyle: {
            display: 'none', // Hide the default tab bar
          },
        }}
        tabBar={(props) => <TabBar {...props} />} // Use the custom tab bar
      >
        <Tabs.Screen
          name="index"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: 'Home',
            tabBarIcon: ({ color }) => <Feather name="home" size={32} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobOffers"
          options={{
            headerShown: false,
            sceneStyle,
            tabBarIcon: ({ color }) => <FontAwesome6 name="anchor" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: 'Settings',
            tabBarIcon: ({ color }) => <Feather name="user" size={32} color={color} />,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}

export default AppLayout
