import { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { useSession } from '@/Providers/SessionProvider'
import { API } from '@/api/consts'

// TODO: once the backend unifies the token format, restore cookie-based auth via
// @react-native-cookies/cookies (removed — its android/build.gradle used jcenter(),
// which breaks EAS builds on current Gradle/AGP; re-add only once that's fixed upstream).

const useAuthBrowser = () => {
  const { auth } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const openUrl = async (url: string) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      let finalUrl = url
      if (auth.token) {
        try {
          const response = await fetch(API.GET_TMP_CODE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: auth.token }),
          })
          if (response.ok) {
            const { tmpCode } = await response.json()
            const separator = url.includes('?') ? '&' : '?'
            finalUrl = `${url}${separator}tmpCode=${encodeURIComponent(tmpCode)}`
          }
        } catch {
          // fall back to opening without tempCode
        }
      }
      await WebBrowser.openBrowserAsync(finalUrl)
    } finally {
      setIsLoading(false)
    }
  }

  return { openUrl, isLoading }
}

export default useAuthBrowser
