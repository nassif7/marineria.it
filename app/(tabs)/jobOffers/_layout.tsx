import React from 'react'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { NavHeader } from '@/components/ui'
import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'

function _layout() {
  const handleGoBack = () => {
    console.log('click')
    router.back()
  }
  const navigation = useNavigation()

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'rgb(30 41 59)' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[offerId]"
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgb(30 41 59)',
          },
        }}
      />
      <Stack.Screen
        name="jobOffer"
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
