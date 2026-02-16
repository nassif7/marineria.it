import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserProvider from '@/Providers/UserProvider'
import { Text } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'
import { TabBar } from '@/components/ui'
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

  const sceneStyle = {
    backgroundColor: 'white',
    paddingStart: 8,
    paddingEnd: 8,
    paddingTop: insets.top,
  }

  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            display: 'none',
          },
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            sceneStyle,
            headerShown: false,

            title: 'Home',
            tabBarIcon: HomeIcon,
          }}
        />
        <Tabs.Screen
          name="pro"
          redirect={role !== AuthTypes.UserRole.CREW}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Crew',
            tabBarIcon: Anchor,
          }}
        />
        <Tabs.Screen
          name="recruiter"
          redirect={role !== AuthTypes.UserRole.RECRUITER}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Recruiter',
            tabBarIcon: Anchor,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,

            title: 'Settings',
            tabBarIcon: UserIcon,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}

export default AppLayout
