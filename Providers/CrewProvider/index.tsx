import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { getCrewUserProfilePost, setPushNotificationToken } from '@/api'
import { TCrewUser } from '@/api/types'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'
import { useSavedOffers } from '@/hooks/useSavedOffers'

type TCrewContext = {
  token: string
  crew?: TCrewUser
  isLoading: boolean
  isRefetching: boolean
  isTogglingNotifications: boolean
  refetch: () => void
  togglePushNotifications: () => void
  savedOfferIds: string[]
  isSavedOffer: (id: string | number) => boolean
  toggleSavedOffer: (id: string | number) => void
}

const CrewContext = createContext<TCrewContext>({
  token: '',
  crew: undefined,
  isLoading: false,
  isRefetching: false,
  isTogglingNotifications: false,
  refetch: () => {},
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
  const { auth } = useSession()
  const token = auth.token ?? ''
  const queryClient = useQueryClient()
  const { savedIds: savedOfferIds, isSaved: isSavedOffer, toggleSaved: toggleSavedOffer } = useSavedOffers()

  const {
    data: crew,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['crew-profile', token, language],
    queryFn: () => getCrewUserProfilePost(token, language),
    enabled: !!token,
  })

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
        isLoading,
        isRefetching,
        isTogglingNotifications,
        refetch,
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
