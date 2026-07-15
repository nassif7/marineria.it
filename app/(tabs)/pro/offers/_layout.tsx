import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

export default function OffersLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('offer-list'),
        }}
      />
      <Stack.Screen
        name="[offerId]"
        options={{
          title: t('offer'),
          headerShown: false,
        }}
      />
    </Stack>
  )
}
