import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserProvider from '@/Providers/UserProvider'
import { Text } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'
import { TabBar, Icon } from '@/components/ui'
import { AuthTypes } from '@/api/types'
import { Anchor, HomeIcon, UserIcon } from 'lucide-react-native'

const AppLayout = () => {
  const { auth, isLoading } = useSession()
  const { token, role } = auth
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
          tabBarActiveTintColor: '#10b981', // Your primary color
          tabBarInactiveTintColor: '#9ca3af', // Gray
          tabBarStyle: {
            display: 'none', // Hide the default tab bar
          },
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Icon as={HomeIcon} size="3xl" className={focused ? 'text-primary-500' : 'text-gray-400'} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobOffers"
          redirect={true}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Job Offers',
            tabBarIcon: ({ focused }) => (
              <Icon as={Anchor} size="3xl" className={focused ? 'text-primary-500' : 'text-gray-400'} />
            ),
          }}
        />
        <Tabs.Screen
          name="proScreens"
          redirect={role !== AuthTypes.UserRole.PRO}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Pro',
            tabBarIcon: ({ focused }) => (
              <Icon as={Anchor} size="3xl" className={focused ? 'text-primary-500' : 'text-gray-400'} />
            ),
          }}
        />
        <Tabs.Screen
          name="recruiterScreens"
          redirect={role !== AuthTypes.UserRole.OWNER}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Recruiter',
            tabBarIcon: ({ focused }) => (
              <Icon as={Anchor} size="3xl" className={focused ? 'text-primary-500' : 'text-gray-400'} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,
            headerStyle,
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <Icon as={UserIcon} size="3xl" className={focused ? 'text-primary-500' : 'text-gray-400'} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  )
}

export default AppLayout
