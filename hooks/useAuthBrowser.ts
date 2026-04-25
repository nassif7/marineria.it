import { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import CookieManager from '@react-native-cookies/cookies'
import { useSession } from '@/Providers/SessionProvider'
import { API } from '@/api/consts'

const MARINERIA_URL = 'https://www.marineria.it'
const COOKIE_NAME = 'MarineriaPRO'

// TODO: once the backend unifies the token format, restore cookie-based auth:
// await CookieManager.set(MARINERIA_URL, {
//   name: COOKIE_NAME,
//   value: auth.token,
//   domain: 'marineria.it',
//   path: '/',
//   secure: true,
//   httpOnly: false,
// })

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
            console.log('[useAuthBrowser] tempCode:', tmpCode)
            const separator = url.includes('?') ? '&' : '?'
            finalUrl = `${url}${separator}tmpCode=${encodeURIComponent(tmpCode)}`
          }
        } catch {
          // fall back to opening without tempCode
        }
      }
      console.log('[useAuthBrowser] opening url:', finalUrl)
      await WebBrowser.openBrowserAsync(finalUrl)
    } finally {
      setIsLoading(false)
    }
  }

  return { openUrl, isLoading }
}

export default useAuthBrowser
