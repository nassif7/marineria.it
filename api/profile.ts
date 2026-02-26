import { API } from './const'
import { UserRole } from '@/api/types/auth'
import { TUser } from '@/api/types/user'
import { getLanguageCode } from './utils'

export const getUserProfile = async (token: string, role: UserRole, language: string): Promise<TUser[]> => {
  const userRole = role == UserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile (${response.status})`)
  }

  return response.json()
}

export const setPushNotificationToken = async (notificationToken: string, pushToken: string): Promise<void> => {
  const url = `${API.NOTIFICATION}/SetPushNotificationToken`
  const body = JSON.stringify({ notificationToken, pushToken })
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch  job offer (${response.status})`)
  }
  return
}
