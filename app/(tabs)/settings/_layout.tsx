import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/appUI'
import { C } from '@/components/appUI/tokens'

function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: C.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout
