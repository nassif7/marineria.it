import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { useCrew } from '@/Providers/CrewProvider'

export const useProfile = () => {
  const { auth } = useSession()
  const recruiter = useRecruiter()
  const crew = useCrew()

  if (auth.role === TUserRole.RECRUITER) {
    return {
      pushNotificationToken: recruiter.recruiter?.pushNotificationToken ?? '',
      togglePushNotifications: recruiter.togglePushNotifications,
      isTogglingNotifications: recruiter.isTogglingNotifications,
    }
  }

  return {
    pushNotificationToken: crew.crew?.pushNotificationToken ?? '',
    togglePushNotifications: crew.togglePushNotifications,
    isTogglingNotifications: crew.isTogglingNotifications,
  }
}
