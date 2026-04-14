import * as WebBrowser from 'expo-web-browser'
import CookieManager from '@react-native-cookies/cookies'
import { useSession } from '@/Providers/SessionProvider'

const MARINERIA_URL = 'https://www.marineria.it'
const COOKIE_NAME = 'MarineriaPRO'

const useAuthBrowser = () => {
  const { auth } = useSession()

  const openUrl = async (url: string) => {
    if (auth.token) {
      await CookieManager.set(MARINERIA_URL, {
        name: COOKIE_NAME,
        value: auth.token,
        domain: 'marineria.it',
        path: '/',
        secure: true,
        httpOnly: false,
      })
    }
    await WebBrowser.openBrowserAsync(url)
  }

  return { openUrl }
}

export default useAuthBrowser
