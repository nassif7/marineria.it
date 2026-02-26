import { useState, createContext, useContext, useEffect } from 'react'
import { signIn } from '@/api/auth'
import { router } from 'expo-router'
import { AuthTypes } from '@/api/types'
import * as SecureStore from 'expo-secure-store'

type SessionContextType = {
  signIn: (userName: string, password: string) => Promise<void>
  signOut: (role: AuthTypes.UserRole) => void
  switchAuth: (role: AuthTypes.UserRole) => void
  auth: { role: AuthTypes.UserRole | null; token: string | null }
  storedAuthTokens: AuthTypes.UserAuth
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  signIn: async () => {},
  signOut: () => null,
  switchAuth: () => null,
  auth: { role: null, token: null },
  storedAuthTokens: { [AuthTypes.UserRole.CREW]: null, [AuthTypes.UserRole.RECRUITER]: null },
  isLoading: false,
})

export const useSession = () => {
  const value = useContext(SessionContext)
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />')
    }
  }
  return value
}

const SessionProvider = (props: React.PropsWithChildren) => {
  const [storedAuthTokens, setStoredAuthTokens] = useState<AuthTypes.UserAuth>({
    [AuthTypes.UserRole.CREW]: null,
    [AuthTypes.UserRole.RECRUITER]: null,
  })
  const [auth, setAuth] = useState<{ role: AuthTypes.UserRole | null; token: string | null }>({
    role: null,
    token: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    hydrateSession()
  }, [])

  const hydrateSession = async () => {
    setIsLoading(true)
    try {
      const role = (await SecureStore.getItemAsync('role')) as AuthTypes.UserRole | null
      const crewToken = await SecureStore.getItemAsync(AuthTypes.UserRole.CREW)
      const recruiterToken = await SecureStore.getItemAsync(AuthTypes.UserRole.RECRUITER)

      const tokens = {
        [AuthTypes.UserRole.CREW]: crewToken,
        [AuthTypes.UserRole.RECRUITER]: recruiterToken,
      }

      setStoredAuthTokens(tokens)

      if (role && tokens[role]) {
        setAuth({ role, token: tokens[role] })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const authenticate = async (userName: string, password: string) => {
    const authData = await signIn(userName, password)
    const { category, token } = authData

    await Promise.all([SecureStore.setItemAsync(category, token), SecureStore.setItemAsync('role', category)])

    setStoredAuthTokens((prev) => ({ ...prev, [category]: token }))
    setAuth({ role: category, token })
  }

  const unAuthenticate = async (role: AuthTypes.UserRole) => {
    const otherRole = role === AuthTypes.UserRole.CREW ? AuthTypes.UserRole.RECRUITER : AuthTypes.UserRole.CREW
    const otherToken = storedAuthTokens[otherRole]

    await SecureStore.deleteItemAsync(role)

    if (otherToken) {
      // User has another active role — switch to it
      await SecureStore.setItemAsync('role', otherRole)
      setAuth({ role: otherRole, token: otherToken })
    } else {
      // No other active role — fully sign out
      await SecureStore.deleteItemAsync('role')
      setAuth({ role: null, token: null })
    }

    setStoredAuthTokens((prev) => ({ ...prev, [role]: null }))
  }

  const switchAuth = async (role: AuthTypes.UserRole) => {
    const token = storedAuthTokens[role]
    if (!token) return
    await SecureStore.setItemAsync('role', role)
    setAuth({ role, token })
  }

  return (
    <SessionContext.Provider
      value={{
        signIn: authenticate,
        signOut: unAuthenticate,
        switchAuth,
        storedAuthTokens,
        auth,
        isLoading,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
