import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'

export default function JobsLayout() {
  const { t } = useTranslation('screens-labels')
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('job-offers'),
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[offerId]"
        options={{
          title: t('offer'),
          headerShown: true,
        }}
      />
    </Stack>
  )
}
