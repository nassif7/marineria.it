import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'

export default function CrewLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
        headerShown: false, // Let nested layouts handle headers
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: (props) => <NavBar {...props} />,
          title: 'Candidates',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          header: (props) => <NavBar {...props} />,
          title: `ID`,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  )
}
