import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cv"
        options={{
          headerShown: true,
          headerTitle: 'CV',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'rgb(30 41 59)',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  )
}

export default _layout
