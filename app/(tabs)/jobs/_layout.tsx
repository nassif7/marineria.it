import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

export default function JobsLayout() {
  const { t } = useTranslation('screens-labels')
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
          headerShown: false,
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
