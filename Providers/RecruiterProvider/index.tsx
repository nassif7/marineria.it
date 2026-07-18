import { createContext, useContext, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { getRecruiterUserProfilePost, getRecruiterActiveSearchesPost, setPushNotificationToken } from '@/api'
import { ApiError } from '@/api/utils'
import { TRecruiterUser, TRecruiterSearch, TNotification, TUserRole } from '@/api/types'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'
import { useNotifications } from '@/hooks/useNotifications'

type TRecruiterContext = {
  token: string
  recruiter?: TRecruiterUser
  searches: TRecruiterSearch[]
  notifications: TNotification[]
  isLoading: boolean
  isRefetching: boolean
  isTogglingNotifications: boolean
  refetch: () => Promise<unknown>
  togglePushNotifications: () => void
}

const RecruiterContext = createContext<TRecruiterContext>({
  token: '',
  recruiter: undefined,
  searches: [],
  notifications: [],
  isLoading: false,
  isRefetching: false,
  isTogglingNotifications: false,
  refetch: () => Promise.resolve(),
  togglePushNotifications: () => {},
})

export const useRecruiter = () => useContext(RecruiterContext)

const RecruiterProvider = ({ children }: React.PropsWithChildren) => {
  const {
    i18n: { language },
  } = useTranslation()
  const { auth, signOut } = useSession()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()

  const {
    data: recruiter,
    isLoading: recruiterLoading,
    isRefetching: recruiterRefetching,
    isSuccess: recruiterLoaded,
    isError: recruiterErrored,
    error: recruiterError,
    refetch: refetchRecruiter,
  } = useQuery({
    queryKey: ['recruiter-profile', token, language],
    queryFn: () => getRecruiterUserProfilePost(token, language),
    enabled: !!token,
  })

  // A stale/revoked token either fails outright (401) or, for this endpoint, responds
  // 200 with an empty/blank payload — detect both and bounce back to sign-in.
  useEffect(() => {
    if (!token) return
    const invalidToken =
      (recruiterLoaded && !recruiter?.iduser) ||
      (recruiterErrored && recruiterError instanceof ApiError && recruiterError.status === 401)
    if (invalidToken) signOut(TUserRole.RECRUITER)
  }, [token, recruiterLoaded, recruiter?.iduser, recruiterErrored, recruiterError, signOut])

  const {
    data: searches = [],
    isLoading: searchesLoading,
    isRefetching: searchesRefetching,
    refetch: refetchSearches,
  } = useQuery({
    queryKey: ['recruiter-searches', token, language],
    queryFn: () => getRecruiterActiveSearchesPost(token, language),
    enabled: !!token,
  })

  const { data: notifications = [], isRefetching: notifRefetching, refetch: refetchNotif } = useNotifications(token)

  const { mutate: togglePushNotifications, isPending: isTogglingNotifications } = useMutation({
    mutationFn: async () => {
      if (recruiter?.pushNotificationToken) {
        await setPushNotificationToken(token, '')
      } else {
        const pushToken = await registerForPushNotificationsAsync()
        if (pushToken) await setPushNotificationToken(token, pushToken)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['recruiter-profile', token] }),
  })

  return (
    <RecruiterContext.Provider
      value={{
        token,
        recruiter,
        searches,
        notifications,
        isLoading: recruiterLoading || searchesLoading,
        isRefetching: recruiterRefetching || searchesRefetching || notifRefetching,
        isTogglingNotifications,
        refetch: () => Promise.all([refetchRecruiter(), refetchSearches(), refetchNotif()]),
        togglePushNotifications,
      }}
    >
      {children}
    </RecruiterContext.Provider>
  )
}

export default RecruiterProvider
