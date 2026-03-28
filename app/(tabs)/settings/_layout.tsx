import React from 'react'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { NavBar } from '@/components/appUI'

function _layout() {
  const {
    auth: { role },
  } = useSession()

  const isPro = role === TUserRole.PRO

  const { t } = useTranslation('screens-labels')

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <NavBar {...props} />,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('settings'), headerShown: true }} />
    </Stack>
  )
}

export default _layout
