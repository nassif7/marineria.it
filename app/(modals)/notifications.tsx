import NotificationsModal from '@/components/crew/profile/NotificationsModal'
import RecruiterNotificationsModal from '@/components/recruiter/profile/RecruiterNotificationsModal'
import { useSession } from '@/Providers/SessionProvider'
import { TUserRole } from '@/api/types'

const NotificationsScreen = () => {
  const {
    auth: { role },
  } = useSession()

  if (role === TUserRole.RECRUITER) {
    return <RecruiterNotificationsModal />
  }
  return <NotificationsModal />
}

export default NotificationsScreen
