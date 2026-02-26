import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { useTranslation } from 'react-i18next'

export default function OfferDetailLayout() {
  const { t } = useTranslation(['screens-labels'])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      {/* Offer details */}
      <Stack.Screen
        name="index"
        options={({ route }) => {
          const { params } = route
          const { searchId } = params as { searchId: string }
          return {
            headerShown: true,
            title: t('search'),
          }
        }}
      />

      {/* Crew section */}
      <Stack.Screen
        name="crew"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}
