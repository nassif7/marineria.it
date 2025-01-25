import { Slot } from 'expo-router'
import '@/global.css'
import { ThemeUIProvider } from '@/components/ui/gluestack-ui-provider'
import SessionProvider from '@/Providers/SessionProvider'
import '@/localization'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as SecureStore from 'expo-secure-store'
import { View } from '@/components/ui'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Scroll } from 'lucide-react-native'
import { ScrollView } from 'react-native'

export default function RootLayout() {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await SecureStore.getItemAsync('language')
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage)
      }
    }
    loadLanguage()
  }, [i18n])

  const changeLanguage = async (lang: string) => {
    await SecureStore.setItemAsync('language', lang)
    i18n.changeLanguage(lang)
  }

  return (
    <ThemeUIProvider mode="light">
      <SafeAreaProvider>
        <SessionProvider>
          <Slot screenOptions={{ headerShown: false }}></Slot>
        </SessionProvider>
      </SafeAreaProvider>
    </ThemeUIProvider>
  )
}
