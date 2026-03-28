import { useState, createContext, useContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { TUserRole, TUserAuth } from '@/api/types'
import { signIn } from '@/api/auth'

type SessionContextType = {
  signIn: (userName: string, password: string) => Promise<void>
  signOut: (role: TUserRole) => void
  switchAuth: (role: TUserRole) => void
  auth: { role: TUserRole | null; token: string | null }
  storedAuthTokens: TUserAuth
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  signIn: async () => {},
  signOut: () => null,
  switchAuth: () => null,
  auth: { role: null, token: null },
  storedAuthTokens: { [TUserRole.PRO]: null, [TUserRole.RECRUITER]: null },
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
  const [storedAuthTokens, setStoredAuthTokens] = useState<TUserAuth>({
    [TUserRole.PRO]: null,
    [TUserRole.RECRUITER]: null,
  })

  const [auth, setAuth] = useState<{ role: TUserRole | null; token: string | null }>({
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
      const role = (await SecureStore.getItemAsync('role')) as TUserRole | null
      const crewToken = await SecureStore.getItemAsync(TUserRole.PRO)
      const recruiterToken = await SecureStore.getItemAsync(TUserRole.RECRUITER)

      const tokens = {
        [TUserRole.PRO]: crewToken,
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

  const authenticate = async (userName: string, password: string) => {
    const authData = await signIn(userName, password)
    const { category, token } = authData

    await Promise.all([SecureStore.setItemAsync(category, token), SecureStore.setItemAsync('role', category)])

    setStoredAuthTokens((prev) => ({ ...prev, [category]: token }))
    setAuth({ role: category, token })
  }

  const unAuthenticate = async (role: TUserRole) => {
    const otherRole = role === TUserRole.PRO ? TUserRole.RECRUITER : TUserRole.PRO
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
