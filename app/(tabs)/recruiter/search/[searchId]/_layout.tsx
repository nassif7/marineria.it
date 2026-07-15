import { Stack } from 'expo-router'
import { C } from '@/components/pro/tokens'
import SearchProvider from '@/Providers/RecruiterSearchProvider'

export default function OfferDetailLayout() {
  return (
    <SearchProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="crew" />
      </Stack>
    </SearchProvider>
  )
}
