import { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { useSession } from '@/Providers/SessionProvider'
import { API } from '@/api/consts'

// TODO: once the backend unifies the token format, restore cookie-based auth via
// @react-native-cookies/cookies (removed — its android/build.gradle used jcenter(),
// which breaks EAS builds on current Gradle/AGP; re-add only once that's fixed upstream).

// Appends a one-time tmpCode so the website logs the user in. Falls back to the bare URL
// if there's no session or the code can't be fetched.
export const withTmpCode = async (url: string, token?: string | null) => {
  if (!token) return url
  try {
    const response = await fetch(API.GET_TMP_CODE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!response.ok) return url
    const { tmpCode } = await response.json()
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}tmpCode=${encodeURIComponent(tmpCode)}`
  } catch {
    return url
  }
}

const useAuthBrowser = () => {
  const { auth } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const openUrl = async (url: string) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await WebBrowser.openBrowserAsync(await withTmpCode(url, auth.token))
    } finally {
      setIsLoading(false)
    }
  }

  return { openUrl, isLoading }
}

export default useAuthBrowser
