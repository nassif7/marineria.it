import { API } from './consts'
import { TUserRole } from '@/api/types/auth'
import { TUser } from '@/api/types/user'
import { apiFetchJson, getLanguageCode } from './utils'

export const getProUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser[]> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  return apiFetchJson<TUser[]>(url)
}

export const getOwnerUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  return apiFetchJson<TUser>(url)
}

export const setPushNotificationToken = async (token: string, pushToken: string): Promise<void> => {
  const url = `${API.NOTIFICATION}/SetPushNotificationToken`
  const body = JSON.stringify({ token, pushToken })

  await apiFetchJson<void>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  })
}
