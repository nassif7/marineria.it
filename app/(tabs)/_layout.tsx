import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserProvider from '@/Providers/UserProvider'
import { Text } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import '@/localization'
import { TabBar, View } from '@/components/ui'
import { AuthTypes } from '@/api/types'
import {
  Anchor,
  HomeIcon,
  UserIcon,
  Briefcase,
  FileText,
  Clipboard,
  ScrollText,
  Search,
  UserSearch,
  UserRoundSearch,
  Users,
  ListFilter,
  Settings,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { NavBar } from '@/components/appUI'

const AppLayout = () => {
  const { t } = useTranslation(['screens-labels'])
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
          redirect={role !== AuthTypes.UserRole.CREW}
          options={{
            headerShown: false,
            sceneStyle,
            title: t('offers'),
            tabBarIcon: Briefcase,
          }}
        />
        <Tabs.Screen
          name="recruiter"
          redirect={role !== AuthTypes.UserRole.RECRUITER}
          options={{
            headerShown: false,
            sceneStyle,
            title: 'Recruitment',
            tabBarIcon: Users,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            sceneStyle,
            headerShown: false,
            title: 'Settings',
            tabBarIcon: Settings,
          }}
        />
      </Tabs>
    </UserProvider>
  )
}

export default AppLayout
