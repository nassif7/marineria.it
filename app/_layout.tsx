import { Slot } from 'expo-router'
import '@/global.css'
import { ThemeUIProvider } from '@/components/ui/gluestack-ui-provider'
import SessionProvider from '@/Providers/SessionProvider'
import '@/localization'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as SecureStore from 'expo-secure-store'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export default function RootLayout() {
  const queryClient = new QueryClient()
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
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SessionProvider>
            <StatusBar translucent={true} style="light" />
            <Slot screenOptions={{ headerShown: false }}></Slot>
          </SessionProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ThemeUIProvider>
  )
}
