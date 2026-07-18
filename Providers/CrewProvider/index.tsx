import { createContext, useContext, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { getCrewUserProfilePost, setPushNotificationToken } from '@/api'
import { ApiError } from '@/api/utils'
import { TCrewUser, TNotification, TUserRole } from '@/api/types'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'
import { useSavedOffers } from '@/hooks/useSavedOffers'
import { useNotifications } from '@/hooks/useNotifications'

type TCrewContext = {
  token: string
  crew?: TCrewUser
  notifications: TNotification[]
  isLoading: boolean
  isRefetching: boolean
  isTogglingNotifications: boolean
  refetch: () => Promise<unknown>
  togglePushNotifications: () => void
  savedOfferIds: string[]
  isSavedOffer: (id: string | number) => boolean
  toggleSavedOffer: (id: string | number) => void
}

const CrewContext = createContext<TCrewContext>({
  token: '',
  crew: undefined,
  notifications: [],
  isLoading: false,
  isRefetching: false,
  isTogglingNotifications: false,
  refetch: () => Promise.resolve(),
  togglePushNotifications: () => {},
  savedOfferIds: [],
  isSavedOffer: () => false,
  toggleSavedOffer: () => {},
})

export const useCrew = () => useContext(CrewContext)

const CrewProvider = ({ children }: React.PropsWithChildren) => {
  const {
    i18n: { language },
  } = useTranslation()
  const { auth, signOut } = useSession()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()
  const { savedIds: savedOfferIds, isSaved: isSavedOffer, toggleSaved: toggleSavedOffer } = useSavedOffers()

  const {
    data: crew,
    isLoading: crewLoading,
    isRefetching: crewRefetching,
    isSuccess: crewLoaded,
    isError: crewErrored,
    error: crewError,
    refetch: refetchCrew,
  } = useQuery({
    queryKey: ['crew-profile', token, language],
    queryFn: () => getCrewUserProfilePost(token, language),
    enabled: !!token,
  })

  // A stale/revoked token either fails outright (401) or, for this endpoint, responds
  // 200 with an empty/blank payload — detect both and bounce back to sign-in.
  useEffect(() => {
    if (!token) return
    const invalidToken =
      (crewLoaded && !crew?.iduser) || (crewErrored && crewError instanceof ApiError && crewError.status === 401)
    if (invalidToken) signOut(TUserRole.CREW)
  }, [token, crewLoaded, crew?.iduser, crewErrored, crewError, signOut])

  const { data: notifications = [], isRefetching: notifRefetching, refetch: refetchNotif } = useNotifications(token)

  const { mutate: togglePushNotifications, isPending: isTogglingNotifications } = useMutation({
    mutationFn: async () => {
      if (crew?.pushNotificationToken) {
        await setPushNotificationToken(token, '')
      } else {
        const pushToken = await registerForPushNotificationsAsync()
        if (pushToken) await setPushNotificationToken(token, pushToken)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['crew-profile', token] }),
  })

  return (
    <CrewContext.Provider
      value={{
        token,
        crew,
        notifications,
        isLoading: crewLoading,
        isRefetching: crewRefetching || notifRefetching,
        isTogglingNotifications,
        refetch: () => Promise.all([refetchCrew(), refetchNotif()]),
        togglePushNotifications,
        savedOfferIds,
        isSavedOffer,
        toggleSavedOffer,
      }}
    >
      {children}
    </CrewContext.Provider>
  )
}

export default CrewProvider
