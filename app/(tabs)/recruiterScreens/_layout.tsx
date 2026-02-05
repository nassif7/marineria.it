import React from 'react'
import { Stack } from 'expo-router'

export default function RecruiterLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="crew" />
    </Stack>
  )
}
