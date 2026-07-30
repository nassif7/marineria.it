import { Redirect, Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { HomeIcon, Briefcase, Users, Settings } from 'lucide-react-native'
import '@/localization'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useCrew } from '@/Providers/CrewProvider'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { Text, View } from '@/components/ui'
import { TabBar } from '@/components/appUI'

const AppLayout = () => {
  const { t } = useTranslation(['screens-labels'])
  const { auth, isLoading, isGuest } = useSession()
  const { token, role } = auth
  const insets = useSafeAreaInsets()
  const { crew, isSuccess: crewLoaded, isError: crewErrored } = useCrew()
  const { recruiter, isSuccess: recruiterLoaded, isError: recruiterErrored } = useRecruiter()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!token && !isGuest) {
    return <Redirect href="/sign-in" />
  }

  if (token) {
    const isCrew = role === TUserRole.CREW
    const profileChecked = isCrew ? crewLoaded || crewErrored : recruiterLoaded || recruiterErrored
    const profileUser = isCrew ? crew : recruiter

    // A stored token can be stale/revoked — don't show the home screen until the
    // profile fetch confirms it belongs to a real user (has an iduser), not just
    // that a token exists in storage. The branded splash (app/_layout.tsx) stays
    // visible for this same condition, so this is covered, not a bare blank screen.
    if (!profileChecked) {
      return null
    }

    if (!profileUser?.iduser) {
      return <Redirect href="/sign-in" />
    }
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

  return tabs
}

export default AppLayout
