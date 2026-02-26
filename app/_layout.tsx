import '@/global.css'
import '@/localization'

import { useEffect, useState } from 'react'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import { Asset } from 'expo-asset'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ThemeUIProvider } from '@/components/ui/gluestack-ui-provider'
import SessionProvider from '@/Providers/SessionProvider'
import { Loading } from '@/components/ui'

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())
  const { i18n } = useTranslation()
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  // prepare the language
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await SecureStore.getItemAsync('language')
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage)
      }
    }
    loadLanguage()
  }, [i18n])

  // prepare the assets
  useEffect(() => {
    const loadAssets = async () => {
      await Asset.loadAsync([require('@/assets/images/splash-bg.png'), require('@/assets/images/marineria_logo.png')])
      setAssetsLoaded(true)
      await SplashScreen.hideAsync()
    }
    loadAssets()
  }, [])

  if (!assetsLoaded) return <Loading />

  return (
    <ThemeUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SessionProvider>
            <StatusBar />
            <Slot screenOptions={{ headerShown: false }} />
          </SessionProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ThemeUIProvider>
  )
}
