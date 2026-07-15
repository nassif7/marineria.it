import { Stack } from 'expo-router'
import { C } from '@/components/pro/tokens'

export default function OffersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[searchId]" />
    </Stack>
  )
}
