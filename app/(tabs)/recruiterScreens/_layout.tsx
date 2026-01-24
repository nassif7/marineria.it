import React from 'react'
import { Stack, usePathname } from 'expo-router'
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
            const showHeader = !usePathname().includes('crewProfile')
            return showHeader ? <NavBar showBackButton={true} /> : null
          },
        }}
      />
    </Stack>
  )
}

export default _layout
