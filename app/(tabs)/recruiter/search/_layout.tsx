import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'

export default function OffersLayout() {
  const { t } = useTranslation(['screens-labels'])

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
          headerShown: true,
          title: t('search-list'),
        }}
      />
      <Stack.Screen name="[searchId]" />
    </Stack>
  )
}
