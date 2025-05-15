import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'

const _layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
      <Stack.Screen
        name="offers"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="crew"
        options={{
          header: (props) => {
            return <NavBar showBackButton={true} />
          },
        }}
      />
    </Stack>
  )
}

export default _layout
