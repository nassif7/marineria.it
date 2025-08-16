import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui-lib'

const _layout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
      <Stack.Screen
        name="index" // pro/jobOffers
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[offerId]" // pro/jobOffers/0009
        options={{
          header: (props) => {
            return <NavBar showBackButton={true} />
          },
        }}
      />
      <Stack.Screen
        name="jobOffer" // pro/jobOffers/jpbOffer
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
