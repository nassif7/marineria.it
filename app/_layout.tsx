import React, { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Slot } from 'expo-router'
import { useTranslation } from 'react-i18next'
import SessionProvider from '@/Providers/SessionProvider'
import { ThemeUIProvider } from '@/components/ui/gluestack-ui-provider'
import '@/localization'
import '@/global.css'

export default function RootLayout() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await SecureStore.getItemAsync('language')
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage)
      }
    }
    loadLanguage()
  }, [i18n])

  return (
    <ThemeUIProvider mode="light">
      <SessionProvider>
        <Slot screenOptions={{ headerShown: false }} />
      </SessionProvider>
    </ThemeUIProvider>
  )
}
