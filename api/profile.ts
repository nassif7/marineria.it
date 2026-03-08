import { API } from './consts'
import { TUserRole } from '@/api/types/auth'
import { TUser } from '@/api/types/user'
import { getLanguageCode } from './utils'

export const getProUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser[]> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile (${response.status})`)
  }

  return response.json()
}

export const getOwnerUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile (${response.status})`)
  }

  return response.json()
}

export const setPushNotificationToken = async (token: string, pushToken: string): Promise<void> => {
  const url = `${API.NOTIFICATION}/SetPushNotificationToken`
  const body = JSON.stringify({ token, pushToken })
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  })

  if (!response.ok) {
    throw new Error(`Failed to set push notification token (${response.status})`)
  }
  return
}
