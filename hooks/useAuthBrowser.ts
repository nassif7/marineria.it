import * as WebBrowser from 'expo-web-browser'

// TODO: once the backend unifies the token format, install @react-native-cookies/cookies
// (requires expo prebuild), retrieve auth.token from useSession, and set the MarineriaPRO
// cookie here before opening the URL so the user is automatically logged in on marineria.it.

const useAuthBrowser = () => {
  const openUrl = async (url: string) => {
    await WebBrowser.openBrowserAsync(url)
  }

  return { openUrl }
}

export default useAuthBrowser
