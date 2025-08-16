import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui-lib'

const _layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
      <Stack.Screen
        name="jobOffers"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default _layout
