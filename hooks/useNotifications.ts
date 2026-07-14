import { useQuery } from '@tanstack/react-query'
import { getCrewNotifications } from '@/api/pro'
import { TNotification } from '@/api/types'

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

export function useNotifications(token: string, mock: boolean = MOCK_NOTIFICATIONS) {
  return useQuery({
    queryKey: ['notifications', token],
    queryFn: () => (mock ? Promise.resolve(FAKE_NOTIFICATIONS) : getCrewNotifications(token)),
    enabled: !!token,
  })
}
