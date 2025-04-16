import { useState, createContext, useContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { UserTypes } from '@/api/types'
import { AuthTypes } from '@/api/types'
import { setNotificationToken } from '@/api/profile'
import { useSession } from '@/Providers/SessionProvider'
import { useNotification } from '@/hooks'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'

export type ActiveProfile = {
  role: AuthTypes.UserRole
  token: string
}

const UserContext = createContext<{
  user?: UserTypes.User
  isLoading?: boolean
  activeProfile?: ActiveProfile
  switchProfile?: (targetRole: AuthTypes.UserRole) => Promise<any>
  setPushNotificationToken?: () => Promise<any>
}>({})

import { getUserProfile } from '@/api'
import { useTranslation } from 'react-i18next'

export const useUser = () => useContext(UserContext)

const UserProvider = (props: React.PropsWithChildren) => {
  const { i18n } = useTranslation()
  const { auth, storedAuthTokens } = useSession()
  const { expoPushToken } = useNotification()

  const { role, token } = auth

  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>()
  const [activeProfile, setActiveProfile] = useState<any>({
    role,
    token,
  })

  const fetchUser = async (token: string, role: AuthTypes.UserRole) => {
    setIsLoading(true)
    try {
      const data: any = await getUserProfile(token, role, i18n.language)

      setUser(data[0])
      setActiveProfile({ role, token })
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
    }
  }

  const toggleNotifications = async () => {
    setIsLoading(true)

    if (user?.pushNotificationToken) {
      await setNotificationToken(token as string, '')
      await fetchUser(token as string, role as AuthTypes.UserRole)
    } else {
      const expoPushToken = await registerForPushNotificationsAsync()
      expoPushToken && (await setNotificationToken(token as string, expoPushToken))
      await fetchUser(token as string, role as AuthTypes.UserRole)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    token && fetchUser(token, role as AuthTypes.UserRole)
  }, [token, role, expoPushToken])

  const switchProfile = async (targetRole: AuthTypes.UserRole) => {
    const token = storedAuthTokens[targetRole] as string
    await SecureStore.setItemAsync('role', targetRole)
    await fetchUser(token, targetRole as AuthTypes.UserRole)
    setActiveProfile({ token, targetRole })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        activeProfile,
        switchProfile,
        setPushNotificationToken: toggleNotifications,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider
