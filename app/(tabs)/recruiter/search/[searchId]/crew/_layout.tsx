// app/(tabs)/recruiterScreens/offers/[offerid]/crew/_layout.tsx
import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { Box, Text } from '@/components/ui'

export default function CrewLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => {
          return <NavBar {...props} />
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
        name="[crewid]"
        options={({ route }) => {
          const { params } = route
          const { crewid } = params as { crewid: string }
          return {
            headerShown: true,
            title: `ID # ${crewid}`,
          }
        }}
      />
    </Stack>
  )
}
