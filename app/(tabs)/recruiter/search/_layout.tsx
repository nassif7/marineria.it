import { Stack } from 'expo-router'
import { NavBar } from '@/lib/components'
import { useTranslation } from 'react-i18next'
import ContactSupport from '@/components/common/ContactSupport'
import { supportTeam } from '@/api'
export default function OffersLayout() {
  const { t } = useTranslation(['screens-labels'])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => (
          <NavBar
            {...props}
            rightAction={<ContactSupport title={t('contact-support', { ns: 'common' })} supportTeam={supportTeam} />}
          />
        ),
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: t('search-list'),
        }}
      />
      <Stack.Screen name="[searchId]" />
    </Stack>
  )
}
