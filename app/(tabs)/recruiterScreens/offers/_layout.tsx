import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'

export default function OffersLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
        header: (props) => <NavBar {...props} />,
      }}
    >
      {/* Offers list - NO HEADER */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* Single offer - HAS HEADER */}
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: 'Offer Details',
        }}
      />
    </Stack>
  )
}
