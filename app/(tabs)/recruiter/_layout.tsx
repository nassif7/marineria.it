import { Stack } from 'expo-router'

export default function RecruiterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
    </Stack>
  )
}
