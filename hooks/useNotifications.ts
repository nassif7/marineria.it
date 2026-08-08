import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, setNotificationRead } from '@/api/profile'
import { TNotification, TUserRole, TUserAuth } from '@/api/types'

type TNotificationsResponse = { notifications: TNotification[] }
type TParsedContact = { name?: string; email?: string; phone?: string; whatsapp?: string }

// Unread notifications always come first; within each group, most recent (highest id) first.
const sortNotifications = (list: TNotification[]) =>
  [...list].sort((a, b) => (a.isread !== b.isread ? a.isread - b.isread : b.id - a.id))

const PENDING_REDIRECT_KEY = 'pendingNotificationRedirect'

// Set right before bouncing an unauthenticated push-notification tap to sign-in, so sign-in
// knows to land the user on the notifications list afterwards instead of the home tab.
export const markPendingNotificationRedirect = () => SecureStore.setItemAsync(PENDING_REDIRECT_KEY, '1')

export const consumePendingNotificationRedirect = async () => {
  const pending = await SecureStore.getItemAsync(PENDING_REDIRECT_KEY)
  if (pending) await SecureStore.deleteItemAsync(PENDING_REDIRECT_KEY)
  return !!pending
}

// A push notification always belongs to one specific account — a recruiter reviewing a
// candidate's CV and a crew member being offered a job are never the same role.
const roleForNotificationType = (type: string): TUserRole | null => {
  if (type === 'cv_profile') return TUserRole.RECRUITER
  if (type === 'job_offer') return TUserRole.CREW
  return null
}

type TPushNotificationContext = {
  activeRole: TUserRole | null
  storedAuthTokens: TUserAuth
  switchAuth: (role: TUserRole) => Promise<void>
}

// Fired when a native push notification is tapped — data shape is whatever was set
// when the push was scheduled (see hooks/usePushNotification.ts's schedulePushNotification).
// Both accounts on a device share the same OS push token, so a notification can arrive for
// whichever role isn't currently active — switch profile first (or bounce to sign-in if the
// user isn't logged into that account at all) so the destination screen has the right
// provider/token mounted under it, then mark it read and navigate.
export const handlePushNotification = async (notificationData: any, context: TPushNotificationContext) => {
  if (!notificationData) return

  const { type, offerId, cvId, id } = notificationData
  const targetRole = roleForNotificationType(type)

  if (targetRole && targetRole !== context.activeRole) {
    if (!context.storedAuthTokens[targetRole]) {
      await markPendingNotificationRedirect()
      router.replace('/sign-in')
      return
    }
    await context.switchAuth(targetRole)
    router.replace('/')
  }

  const role = targetRole ?? context.activeRole
  const token = role && context.storedAuthTokens[role]
  if (id && token) setNotificationRead(Number(id), token).catch(() => {})

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
