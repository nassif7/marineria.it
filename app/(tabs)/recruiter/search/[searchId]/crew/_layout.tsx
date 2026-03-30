// app/(tabs)/recruiterScreens/offers/[offerid]/crew/_layout.tsx
import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { Box, Text } from '@/lib/components/ui'
import { supportTeam } from '@/api'
import ContactSupport from '@/components/common/ContactSupport'

export default function CrewLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => {
          return (
            <NavBar
              {...props}
              rightAction={<ContactSupport title={t('contact-support', { ns: 'common' })} supportTeam={supportTeam} />}
            />
          )
        },
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          title: t('crew-list'),
        }}
      />

      <Stack.Screen
        name="[crewId]"
        options={() => {
          return {
            headerShown: true,
            title: t('crew-profile'),
          }
        }}
      />
    </Stack>
  )
}
