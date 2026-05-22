// app/(tabs)/recruiterScreens/offers/[offerid]/crew/_layout.tsx
import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

export default function CrewLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="list" />
      <Stack.Screen
        name="[crewId]"
        options={{
          headerShown: true,
          header: (props) => <NavBar {...props} />,
          title: t('crew-profile'),
        }}
      />
    </Stack>
  )
}
