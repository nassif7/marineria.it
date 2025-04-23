import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'

function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="switchUser"
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
