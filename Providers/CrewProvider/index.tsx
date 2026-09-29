import { createContext, useContext, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/Providers/SessionProvider'
import {
  getCrewUserProfilePost,
  setPushNotificationToken,
  setCrewAvailability,
  getCrewAvailabilityData,
  TAvailabilityResponse,
} from '@/api'
import { ApiError } from '@/api/utils'
import { TCrewUser, TNotification, TUserRole } from '@/api/types'
import {
  registerForPushNotificationsAsync,
  scheduleAvailabilityReminder,
  cancelAvailabilityReminder,
} from '@/hooks/usePushNotification'
import { useSavedOffers } from '@/hooks/useSavedOffers'
import { useNotifications } from '@/hooks/useNotifications'
import { getLocalPushToken, setLocalPushToken, clearLocalPushToken } from '@/hooks/usePushTokenSync'
import { getCrewAvailability, getGenderEnding, getAvailabilityReminderDates } from '@/utils/crewUtils'

type TCrewContext = {
  token: string
  crew?: TCrewUser
  notifications: TNotification[]
  markNotificationAsRead: (notification: TNotification) => void
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  isRefetching: boolean
  isTogglingNotifications: boolean
  refetch: () => Promise<unknown>
  togglePushNotifications: () => void
  availability?: TAvailabilityResponse
  isLoadingAvailability: boolean
  updateAvailability: (args: { available: boolean; availableFrom?: string }) => Promise<TAvailabilityResponse>
  isUpdatingAvailability: boolean
  savedOfferIds: string[]
  isSavedOffer: (id: string | number) => boolean
  toggleSavedOffer: (id: string | number) => void
}

const CrewContext = createContext<TCrewContext>({
  token: '',
  crew: undefined,
  notifications: [],
  markNotificationAsRead: () => {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  isRefetching: false,
  isTogglingNotifications: false,
  refetch: () => Promise.resolve(),
  togglePushNotifications: () => {},
  availability: undefined,
  isLoadingAvailability: false,
  updateAvailability: () => Promise.reject(new Error('CrewProvider not mounted')),
  isUpdatingAvailability: false,
  savedOfferIds: [],
  isSavedOffer: () => false,
  toggleSavedOffer: () => {},
})

export const useCrew = () => useContext(CrewContext)

const CrewProvider = ({ children }: React.PropsWithChildren) => {
  const {
    t,
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

  // The main profile response's own availability fields have proven unreliable (stale flag,
  // inconsistent date formats) — this dedicated endpoint is the source of truth for the
  // availability section specifically.
  const { data: availability, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['crew-availability', token, language],
    queryFn: () => getCrewAvailabilityData(token, language),
    enabled: !!token,
  })

  // Local reminders, not server-sent: 11:00 the day after the available-from date, then weekly
  // while it stays expired (the in-app alert on the profile screen covers each app open). Lives
  // here (not on the profile screen) so it's set up as soon as availability loads on app launch —
  // whether or not the crew ever opens their profile screen — and reconciles whenever it changes,
  // including a date set from the web panel or another device.
  useEffect(() => {
    if (!availability) return
    const { status, date: availableDate } = getCrewAvailability(
      availability.available === 1,
      availability.dateavailability,
      language,
      t,
      crew?.gender
    )
    // 'not-available' means the crew switched availability off (or never set a date) — nothing to remind.
    if (status !== 'not-available' && availableDate) {
      scheduleAvailabilityReminder(getAvailabilityReminderDates(availableDate), {
        title: t('crew-profile.availability-reminder-title', { ns: 'home-screen' }),
        body: t('crew-profile.availability-expired', {
          ns: 'home-screen',
          genderEnding: getGenderEnding(crew?.gender),
        }),
      })
      return
    }
    cancelAvailabilityReminder()
  }, [availability, crew?.gender, language, t])

  const {
    data: notifications = [],
    isRefetching: notifRefetching,
    refetch: refetchNotif,
    markAsRead: markNotificationAsRead,
  } = useNotifications(token, 'crew')

  // The BE keeps a single pushNotificationToken per account, so logging in on another
  // device overwrites it. Reconcile against what this device last set on login/refresh
  // so it reclaims its slot instead of silently going deaf.
  useEffect(() => {
    if (!crewLoaded || !token) return
    getLocalPushToken(TUserRole.CREW).then((localToken) => {
      if (localToken && localToken !== crew?.pushNotificationToken) {
        setPushNotificationToken(token, localToken).then(() =>
          queryClient.invalidateQueries({ queryKey: ['crew-profile', token] })
        )
      }
    })
  }, [crewLoaded, crew?.pushNotificationToken, token, queryClient])

  const { mutate: togglePushNotifications, isPending: isTogglingNotifications } = useMutation({
    mutationFn: async () => {
      if (crew?.pushNotificationToken) {
        await setPushNotificationToken(token, '')
        await clearLocalPushToken(TUserRole.CREW)
      } else {
        const pushToken = await registerForPushNotificationsAsync()
        if (pushToken) {
          await setPushNotificationToken(token, pushToken)
          await setLocalPushToken(TUserRole.CREW, pushToken)
        }
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['crew-profile', token] }),
  })

  const { mutateAsync: updateAvailability, isPending: isUpdatingAvailability } = useMutation({
    mutationFn: ({ available, availableFrom }: { available: boolean; availableFrom?: string }) =>
      setCrewAvailability(token, language, available, availableFrom),
    onSuccess: (response) => {
      // The response is authoritative — patch it straight into the cache instead of refetching,
      // so the rest of the screen doesn't reload/flash.
      queryClient.setQueryData(['crew-availability', token, language], response)
      queryClient.setQueryData(['crew-profile', token, language], (old: TCrewUser | undefined) =>
        old ? { ...old, dateAvailability: response.dateavailability ?? '' } : old
      )
    },
  })

  return (
    <CrewContext.Provider
      value={{
        token,
        crew,
        notifications,
        markNotificationAsRead,
        isLoading: crewLoading,
        isSuccess: crewLoaded,
        isError: crewErrored,
        isRefetching: crewRefetching || notifRefetching,
        isTogglingNotifications,
        refetch: () => Promise.all([refetchCrew(), refetchNotif()]),
        togglePushNotifications,
        availability,
        isLoadingAvailability,
        updateAvailability,
        isUpdatingAvailability,
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
