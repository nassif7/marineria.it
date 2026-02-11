import React from 'react'
import { Stack } from 'expo-router'
import { NavBar } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { AuthTypes } from '@/api/types'

function _layout() {
  const {
    auth: { role },
  } = useSession()

  const isPro = role === AuthTypes.UserRole.PRO

  const { t } = useTranslation()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'rgb(30 41 59)' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen
        name="switchUser"
        options={{
          headerShown: true,
          title: t(isPro ? 'switchToOwner' : 'switchToPro'),
        }}
      />
    </Stack>
  )
}

export default _layout
