import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'

export default function CrewLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
        header: (props) => <NavBar {...props} />,
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          headerShown: true,
          title: 'Candidates',
        }}
      />

      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          headerShown: true,
          title: `ID`,
        })}
      />
    </Stack>
  )
}
