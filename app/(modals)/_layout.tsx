import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notifications" />
      <Stack.Screen name="offer/[offerId]" />
    </Stack>
  )
}
