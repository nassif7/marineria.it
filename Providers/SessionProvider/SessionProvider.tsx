import { useState, createContext, useContext, useEffect } from 'react'
import { signIn } from '@/api/auth'
import { router } from 'expo-router'
import { AuthTypes, isErrorResponse, ErrorTypes } from '@/api/types'
import * as SecureStore from 'expo-secure-store'
import { useQuery } from '@tanstack/react-query'

type SessionContextType = {
  signIn: (userName: string, password: string, onSuccess?: () => Promise<any> | void, onError?: () => void) => void
  signOut: (role: AuthTypes.UserRole) => void
  switchAuth: (role: AuthTypes.UserRole) => void
  auth: { role: AuthTypes.UserRole | null; token: string | null }
  storedAuthTokens: AuthTypes.UserAuth
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  signIn: async () => null,
  signOut: () => null,
  switchAuth: () => null,
  auth: { role: null, token: null },
  storedAuthTokens: { [AuthTypes.UserRole.PRO]: null, [AuthTypes.UserRole.OWNER]: null },
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
    [AuthTypes.UserRole.PRO]: null,
    [AuthTypes.UserRole.OWNER]: null,
  })
  const [auth, setAuth] = useState<{ role: AuthTypes.UserRole | null; token: string | null }>({
    role: null,
    token: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const authenticate = async (
    userName: string,
    password: string,
    onSuccess?: () => Promise<any> | void,
    onError?: (message: string) => void
  ) => {
    const authData = await signIn(userName, password)
    if (authData instanceof Error) {
      onError && onError(authData.message)
      return
    }
    const { category, token } = authData
    await SecureStore.setItemAsync(category, token)
    await SecureStore.setItemAsync('role', category)
    setStoredAuthTokens({ ...storedAuthTokens, [category]: token })
    setAuth({ role: category, token })
    onSuccess && onSuccess()
  }

  useEffect(() => {
    //#TODO this need to be improved
    async function fetchStoredTokens() {
      setIsLoading(true)
      const role = (await SecureStore.getItemAsync('role')) as AuthTypes.UserRole
      const token = role && (await SecureStore.getItemAsync(role as string))
      const storedProToken = await SecureStore.getItemAsync(AuthTypes.UserRole.PRO)
      const storedOwnerToken = await SecureStore.getItemAsync(AuthTypes.UserRole.OWNER)
      role && token && setAuth({ role, token })

      setStoredAuthTokens({
        [AuthTypes.UserRole.PRO]: storedProToken,
        [AuthTypes.UserRole.OWNER]: storedOwnerToken,
      })

      setIsLoading(false)
    }

    fetchStoredTokens()
  }, [])

  const unAuthenticate = async (role: AuthTypes.UserRole) => {
    const proToken = storedAuthTokens[AuthTypes.UserRole.PRO]
    const ownerToken = storedAuthTokens[AuthTypes.UserRole.OWNER]

    if (proToken && ownerToken) {
      const activeRole = role == AuthTypes.UserRole.PRO ? AuthTypes.UserRole.OWNER : AuthTypes.UserRole.PRO
      const activeToken = role == AuthTypes.UserRole.PRO ? ownerToken : proToken

      await SecureStore.setItemAsync('role', activeRole)
      setAuth({
        role: activeRole,
        token: activeToken,
      })
      setStoredAuthTokens({
        ...storedAuthTokens,
        [role]: null,
      })
    } else {
      await SecureStore.deleteItemAsync(role)
      await SecureStore.deleteItemAsync('role')
      setAuth({ role: null, token: null })
      setStoredAuthTokens({
        ...storedAuthTokens,
        [role]: null,
      })
    }

    router.push('/')
  }

  const switchAuth = async (role: AuthTypes.UserRole) => {
    await SecureStore.setItemAsync('role', role)
    const token = storedAuthTokens[role]
    setAuth({ role, token })
  }

  return (
    <SessionContext.Provider
      value={{
        signIn: authenticate,
        signOut: unAuthenticate,
        switchAuth,
        storedAuthTokens: storedAuthTokens,
        auth,
        isLoading,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
