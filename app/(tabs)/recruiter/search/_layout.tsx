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
        animation: 'slide_from_right', // iOS-style slide
        animationDuration: 300, // Milliseconds (default is 350)
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
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
