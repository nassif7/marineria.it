import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function OffersLayout() {
  const { t } = useTranslation()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: t('recruiter.searches'),
        }}
      />
      <Stack.Screen name="[searchId]" />
    </Stack>
  )
}
