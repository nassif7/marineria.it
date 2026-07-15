import { useQuery } from '@tanstack/react-query'
import { getCrewNotifications } from '@/api/pro'

export function useNotifications(token: string) {
  return useQuery({
    queryKey: ['notifications', token],
    queryFn: () => getCrewNotifications(token),
    enabled: !!token,
  })
}
