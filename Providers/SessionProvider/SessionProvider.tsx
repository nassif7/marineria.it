import { useState, createContext, useContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { TUserRole, TUserAuth } from '@/api/types'
import { signIn, loginCode } from '@/api/auth'

type SessionContextType = {
  signIn: (userName: string, password: string) => Promise<void>
  loginWithCode: (username: string, code: string) => Promise<void>
  signOut: (role: TUserRole) => void
  switchAuth: (role: TUserRole) => void
  continueAsGuest: () => void
  auth: { role: TUserRole | null; token: string | null }
  storedAuthTokens: TUserAuth
  isLoading: boolean
  isGuest: boolean
}

const SessionContext = createContext<SessionContextType>({
  signIn: async () => {},
  loginWithCode: async () => {},
  signOut: () => null,
  switchAuth: () => null,
  continueAsGuest: () => null,
  auth: { role: null, token: null },
  storedAuthTokens: { [TUserRole.CREW]: null, [TUserRole.RECRUITER]: null },
  isLoading: false,
  isGuest: false,
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
  const [storedAuthTokens, setStoredAuthTokens] = useState<TUserAuth>({
    [TUserRole.CREW]: null,
    [TUserRole.RECRUITER]: null,
  })

  const [auth, setAuth] = useState<{ role: TUserRole | null; token: string | null }>({
    role: null,
    token: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    hydrateSession()
  }, [])

  const hydrateSession = async () => {
    setIsLoading(true)
    try {
      const role = (await SecureStore.getItemAsync('role')) as TUserRole | null
      const crewToken = await SecureStore.getItemAsync(TUserRole.CREW)
      const recruiterToken = await SecureStore.getItemAsync(TUserRole.RECRUITER)

      const tokens = {
        [TUserRole.CREW]: crewToken,
        [TUserRole.RECRUITER]: recruiterToken,
      }

      setStoredAuthTokens(tokens)

      if (role && tokens[role]) {
        setAuth({ role, token: tokens[role] })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const continueAsGuest = () => setIsGuest(true)

  const storeAuthData = async (category: TUserRole, token: string) => {
    setIsGuest(false)
    await Promise.all([SecureStore.setItemAsync(category, token), SecureStore.setItemAsync('role', category)])
    setStoredAuthTokens((prev) => ({ ...prev, [category]: token }))
    setAuth({ role: category, token })
  }

  const authenticate = async (userName: string, password: string) => {
    const { category, token } = await signIn(userName, password)
    await storeAuthData(category, token)
  }

  const authenticateWithCode = async (username: string, code: string) => {
    const { category, token } = await loginCode(username, code)
    await storeAuthData(category, token)
  }

  const unAuthenticate = async (role: TUserRole) => {
    const otherRole = role === TUserRole.CREW ? TUserRole.RECRUITER : TUserRole.CREW
    const otherToken = storedAuthTokens[otherRole]

    await SecureStore.deleteItemAsync(role)

    if (otherToken) {
      await SecureStore.setItemAsync('role', otherRole)
      setAuth({ role: otherRole, token: otherToken })
    } else {
      await SecureStore.deleteItemAsync('role')
      setAuth({ role: null, token: null })
    }

    setStoredAuthTokens((prev) => ({ ...prev, [role]: null }))
  }

  const switchAuth = async (role: TUserRole) => {
    const token = storedAuthTokens[role]
    if (!token) return
    await SecureStore.setItemAsync('role', role)
    setAuth({ role, token })
  }

  return (
    <SessionContext.Provider
      value={{
        signIn: authenticate,
        loginWithCode: authenticateWithCode,
        signOut: unAuthenticate,
        switchAuth,
        continueAsGuest,
        storedAuthTokens,
        auth,
        isLoading,
        isGuest,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
