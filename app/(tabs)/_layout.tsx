import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { HomeIcon, Briefcase, Users, Settings } from 'lucide-react-native'
import '@/localization'
import { TUserRole } from '@/api/types'
import RecruiterProvider from '@/Providers/RecruiterProvider'
import CrewProvider from '@/Providers/CrewProvider'
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

  const proSceneStyle = {
    backgroundColor: '#F6F5F2',
    paddingTop: insets.top - 12,
  }

  const tabs = (
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
          sceneStyle: proSceneStyle,
          headerShown: false,
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="pro"
        redirect={role !== TUserRole.CREW}
        options={{
          headerShown: false,
          sceneStyle: proSceneStyle,
          title: t('offers'),
          tabBarIcon: Briefcase,
        }}
      />
      <Tabs.Screen
        name="recruiter"
        redirect={role !== TUserRole.RECRUITER}
        options={{
          headerShown: false,
          sceneStyle: proSceneStyle,
          title: t('recruitment'),
          tabBarIcon: Users,
        }}
      />
      <Tabs.Screen
        name="jobs"
        redirect={!isGuest}
        options={{
          headerShown: false,
          sceneStyle: proSceneStyle,
          title: t('offers'),
          tabBarIcon: Briefcase,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          sceneStyle: proSceneStyle,
          headerShown: false,
          title: t('settings'),
          tabBarIcon: Settings,
        }}
      />
    </Tabs>
  )

  if (role === TUserRole.RECRUITER) {
    return <RecruiterProvider>{tabs}</RecruiterProvider>
  }

  return <CrewProvider>{tabs}</CrewProvider>
}

export default AppLayout
