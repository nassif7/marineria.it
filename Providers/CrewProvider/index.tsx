import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import { getCrewUserProfilePost, setPushNotificationToken } from '@/api'
import { getCrewNotifications } from '@/api/pro'
import { TCrewUser, TNotification } from '@/api/types'
import { registerForPushNotificationsAsync } from '@/hooks/useNotification'
import { useSavedOffers } from '@/hooks/useSavedOffers'

type TCrewContext = {
  token: string
  crew?: TCrewUser
  notifications: TNotification[]
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
  notifications: [],
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

// TEMP: the backend has no real notifications yet — fake a few so the UI can be tested. Flip to false to disable.
const MOCK_NOTIFICATIONS = true
const FAKE_NOTIFICATIONS: TNotification[] = [
  {
    category: 'offer',
    title: 'New matching offer',
    message: 'A new job offer matching your profile was just posted.',
    idoffer: 1234,
    iduser: 0,
    link: '',
  },
  {
    category: 'profile',
    title: 'Profile viewed',
    message: 'A recruiter viewed your profile this week.',
    idoffer: 0,
    iduser: 0,
    link: '',
  },
  {
    category: 'document',
    title: 'Document expiring soon',
    message: "Your seaman's book is expiring in 30 days.",
    idoffer: 0,
    iduser: 0,
    link: '',
  },
]

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
    isLoading: crewLoading,
    isRefetching: crewRefetching,
    refetch: refetchCrew,
  } = useQuery({
    queryKey: ['crew-profile', token, language],
    queryFn: () => getCrewUserProfilePost(token, language),
    enabled: !!token,
  })

  const {
    data: notifications = [],
    isRefetching: notifRefetching,
    refetch: refetchNotif,
  } = useQuery({
    queryKey: ['crew-notifications', token],
    queryFn: () => (MOCK_NOTIFICATIONS ? Promise.resolve(FAKE_NOTIFICATIONS) : getCrewNotifications(token)),
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
        notifications,
        isLoading: crewLoading,
        isRefetching: crewRefetching || notifRefetching,
        isTogglingNotifications,
        refetch: () => {
          refetchCrew()
          refetchNotif()
        },
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
