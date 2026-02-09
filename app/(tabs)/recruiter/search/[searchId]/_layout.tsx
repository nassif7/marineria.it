// app/(tabs)/recruiterScreens/offers/[offerid]/_layout.tsx
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function OfferDetailLayout() {
  const { t } = useTranslation()
  return (
    <Stack
      screenOptions={{
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
        animation: 'slide_from_right', // iOS-style slide
        animationDuration: 300, // Milliseconds (default is 350)
        animationTypeForReplace: 'push',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
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
            title: `${t('recruiter.view-search-id')} # ${searchId}`,
          }
        }}
      />

      {/* Crew section */}
      <Stack.Screen
        name="crew"
        options={{
          headerShown: false, // Let crew/_layout handle headers
        }}
      />
    </Stack>
  )
}
