import React from 'react'
import { Stack } from 'expo-router'

function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen
        name="switchUser"
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgb(30 41 59)',
          },
        }}
      />
    </Stack>
  )
}

export default _layout
