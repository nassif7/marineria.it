import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { HomeIcon, Briefcase, Users, Settings, Globe } from 'lucide-react-native'
import '@/localization'
import { TUserRole } from '@/api/types'
import UserProvider from '@/Providers/UserProvider'
import { useSession } from '@/Providers/SessionProvider'
import { Text, View } from '@/components/ui'
import { TabBar } from '@/components/appUI'

const AppLayout = () => {
  const { t } = useTranslation(['screens-labels'])
  const { auth, isLoading, isGuest } = useSession()
  const { token, role } = auth
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!token && !isGuest) {
    return <Redirect href="/sign-in" />
  }

  const sceneStyle = {
    backgroundColor: 'white',
    paddingTop: insets.top - 12,
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
            title: 'Home',
            tabBarIcon: HomeIcon,
            header: (props) => <View className="min-h-[50px]  bg-white"></View>,
          }}
        />
        <Tabs.Screen
          name="pro"
          redirect={role !== TUserRole.CREW}
          options={{
            headerShown: false,
            sceneStyle,
            title: t('offers'),
            tabBarIcon: Briefcase,
          }}
        />
        <Tabs.Screen
          name="recruiter"
          redirect={role !== TUserRole.RECRUITER}
          options={{
            headerShown: false,
            sceneStyle,
            title: t('recruitment'),
            tabBarIcon: Users,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            headerShown: false,
            sceneStyle,
            title: t('jobs'),
            tabBarIcon: Globe,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,
            title: t('settings'),
            tabBarIcon: Settings,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}

export default AppLayout
