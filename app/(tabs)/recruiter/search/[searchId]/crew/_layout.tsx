// app/(tabs)/recruiterScreens/offers/[offerid]/crew/_layout.tsx
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function CrewLayout() {
  const { t } = useTranslation()
  return (
    <Stack
      screenOptions={{
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          headerShown: true,
          title: t('recruiter.crew-list'),
        }}
      />

      <Stack.Screen
        name="[crewId]"
        options={({ route }) => {
          const { params } = route
          const { crewId } = params as { crewId: string }
          return {
            headerShown: true,
            title: `ID # ${crewId}`,
          }
        }}
      />
    </Stack>
  )
}
