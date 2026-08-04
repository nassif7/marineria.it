import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, setNotificationRead } from '@/api/profile'
import { TNotification } from '@/api/types'

type TNotificationsResponse = { notifications: TNotification[] }
type TParsedContact = { name?: string; email?: string; phone?: string; whatsapp?: string }

// Unread notifications always come first; within each group, most recent (highest id) first.
const sortNotifications = (list: TNotification[]) =>
  [...list].sort((a, b) => (a.isread !== b.isread ? a.isread - b.isread : b.id - a.id))

// Fired when a native push notification is tapped — data shape is whatever was set
// when the push was scheduled (see hooks/usePushNotification.ts's schedulePushNotification).
// Marks it read (if an id was included) and navigates to the right screen.
export const handlePushNotification = async (notificationData: any) => {
  if (!notificationData) return

  const { type, offerId, cvId, id } = notificationData

  if (id) {
    const role = await SecureStore.getItemAsync('role')
    const token = role && (await SecureStore.getItemAsync(role))
    if (token) setNotificationRead(Number(id), token).catch(() => {})
  }

  switch (type) {
    case 'cv_profile':
      if (offerId && cvId) {
        router.push(`/recruiter/search/${offerId}/crew/${cvId}`)
      }
      break

    case 'job_offer':
      if (offerId) {
        router.push(`/pro/offers/${offerId}`)
      }
      break

    default:
      router.push('/(tabs)')
      break
  }
}

// Where a tap on an in-app notification list row should go — recruiter side (candidate CV).
export const navigateToCrewFromNotification = (notification: TNotification) => {
  router.push({
    pathname: '/cv/[crewId]',
    params: {
      crewId: String(notification.iduser),
      searchId: String(notification.idoffer),
    },
  })
}

// Where a tap on an in-app notification list row should go — crew side (offer detail),
// optionally carrying the recruiter's parsed contact info along as route params.
export const navigateToOfferFromNotification = (notification: TNotification, contact: TParsedContact | null) => {
  router.push({
    pathname: '/offer/[offerId]',
    params: {
      offerId: String(notification.idoffer),
      ...(contact?.name && { recruiterName: contact.name }),
      ...(contact?.email && { recruiterEmail: contact.email }),
      ...(contact?.phone && { recruiterPhone: contact.phone }),
      ...(contact?.whatsapp && { recruiterWhatsapp: contact.whatsapp }),
    },
  })
}

export function useNotifications(token: string, role: 'crew' | 'recruiter' = 'crew') {
  const queryClient = useQueryClient()
  const queryKey = ['notifications', token, role]

  const query = useQuery({
    queryKey,
    queryFn: () => getNotifications(token, role),
    enabled: !!token,
    select: (data: TNotificationsResponse) => sortNotifications(data.notifications ?? []),
  })

  const markAsRead = (notification: TNotification) => {
    if (notification.isread) return
    queryClient.setQueryData<TNotificationsResponse>(queryKey, (prev) => ({
      notifications: (prev?.notifications ?? []).map((n) => (n.id === notification.id ? { ...n, isread: 1 } : n)),
    }))
    setNotificationRead(notification.id, token).catch(() => {})
  }

  return { ...query, markAsRead }
}
