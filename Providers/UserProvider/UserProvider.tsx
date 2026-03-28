import { createContext, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { TUserRole, TUser } from '@/api/types'
import { getProUserProfile, getOwnerUserProfile, setPushNotificationToken } from '@/api'
import { useSession } from '@/Providers/SessionProvider'
import { ApiError } from '@/api/utils'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'

export type TActiveProfile = {
  role: TUserRole
  token: string
}

type UserContextType = {
  user?: TUser
  isLoading: boolean
  isTogglingNotifications: boolean
  activeProfile?: TActiveProfile
  switchProfile: (targetRole: TUserRole) => Promise<void>
  togglePushNotifications: () => void
}

const UserContext = createContext<UserContextType>({
  isLoading: false,
  isTogglingNotifications: false,
  activeProfile: undefined,
  user: undefined,
  switchProfile: async () => {},
  togglePushNotifications: () => {},
})

export const useUser = () => useContext(UserContext)

const UserProvider = (props: React.PropsWithChildren) => {
  const {
    i18n: { language },
  } = useTranslation()
  const { auth, storedAuthTokens, switchAuth, signOut } = useSession()
  const queryClient = useQueryClient()

  const { role, token } = auth

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', token, role, language],
    queryFn: async () => {
      const data = await (role === TUserRole.RECRUITER ? getOwnerUserProfile : getProUserProfile)(
        token as string,
        role as TUserRole,
        language
      )

      return Array.isArray(data) ? data?.[0] : data
    },

    enabled: !!token && !!role,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) return false
      return failureCount < 3
    },
    throwOnError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        signOut(role as TUserRole)
      }
      return false
    },
  })

  const switchProfile = async (targetRole: TUserRole) => {
    const targetToken = storedAuthTokens[targetRole] as string
    await SecureStore.setItemAsync('role', targetRole)
    await switchAuth(targetRole)
  }

  const { mutate: togglePushNotifications, isPending: isTogglingNotifications } = useMutation({
    mutationFn: async () => {
      if (user?.pushNotificationToken) {
        await setPushNotificationToken(token as string, '')
      } else {
        const pushToken = await registerForPushNotificationsAsync()
        pushToken && (await setPushNotificationToken(token as string, pushToken))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', token, role] })
    },
  })

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isTogglingNotifications,
        activeProfile: token && role ? { token, role } : undefined,
        switchProfile,
        togglePushNotifications,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider
