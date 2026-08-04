import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, setNotificationRead } from '@/api/profile'
import { TNotification } from '@/api/types'

type TNotificationsResponse = { notifications: TNotification[] }

// Unread notifications always come first; within each group, most recent (highest id) first.
const sortNotifications = (list: TNotification[]) =>
  [...list].sort((a, b) => (a.isread !== b.isread ? a.isread - b.isread : b.id - a.id))

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
