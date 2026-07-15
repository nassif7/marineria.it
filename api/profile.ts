import { API } from './consts'
import { TUserRole } from '@/api/types/auth'
import { TUser } from '@/api/types/user'
import { TRecruiterUser } from '@/api/types/recruiterUser'
import { TCrewUser } from '@/api/types/crewUser'
import { apiFetchJson, apiFetchText, getLanguageCode } from './utils'

export const getProUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser[]> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  const data = await apiFetchJson<any>(url)
  const arr = Array.isArray(data) ? data : [data]
  // API returns "publisched" (server-side typo), normalize to "published"
  return arr.map((u) => ({ ...u, published: u.publisched }))
}

export const getProUserProfilePost = async (token: string, language: string): Promise<TUser[]> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/Prouser`
  const data = await apiFetchJson<any>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  const arr = Array.isArray(data) ? data : [data]
  return arr.map((u) => ({ ...u, published: u.publisched }))
}

export const getOwnerUserProfile = async (token: string, role: TUserRole, language: string): Promise<TUser> => {
  const userRole = role == TUserRole.RECRUITER ? 'Owneruser' : 'Prouser'
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/${userRole}/${token}?lang=${languageCode}`
  return apiFetchJson<TUser>(url)
}

export const getOwnerUserProfilePost = async (token: string, language: string): Promise<TUser> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/Owneruser/Owner`
  return apiFetchJson<TUser>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
}

export const getRecruiterUserProfilePost = async (token: string, language: string): Promise<TRecruiterUser> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/Owneruser/Owner`
  const raw = await apiFetchJson<any>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  const u = raw?.items ?? (Array.isArray(raw) ? raw[0] : raw)
  return {
    iduser: u.idUtente ?? u.iduser ?? 0,
    name: u.name ?? '',
    surname: u.surname ?? '',
    company: u.company ?? '',
    address: u.address ?? '',
    city: u.city ?? '',
    province: u.province ?? '',
    zipCode: u.zipcode ?? u.zipCode ?? '',
    email: u.email ?? '',
    emailCc: u.emailCc ?? '',
    url: u.url ?? '',
    cellular: u.cellular ?? '',
    telephone: u.telephone ?? '',
    whatsapp: u.callWhatsapp ?? '',
    fax: u.fax ?? '',
    callWhatsapp: u.callWhatsapp ?? '',
    pushNotificationToken: u.pushNotificationToken ?? '',
    lastAccessDate: u.last_access_date ?? u.lastAccessDate ?? '',
    registrationDate: u.registration_date ?? u.registrationDate ?? '',
  }
}

export const getCrewUserProfilePost = async (token: string, language: string): Promise<TCrewUser> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.PROFILE}/Prouser`
  const raw = await apiFetchJson<any>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  const items = raw?.items
  const u = items ? (Array.isArray(items) ? items[0] : items) : ((Array.isArray(raw) ? raw[0] : raw) ?? {})

  return {
    ...u,
    published: u.publisched ?? u.published ?? '',
    lastAccessDate: u.lastAccessDate ?? u.last_access_date ?? '',
    registraton_date: u.registraton_date ?? u.registration_date ?? u.registrationDate ?? '',
    registrationDate: u.registraton_date ?? u.registration_date ?? u.registrationDate ?? '',
  } as TCrewUser
}

export const setPushNotificationToken = async (token: string, pushToken: string): Promise<void> => {
  const url = `${API.NOTIFICATION}/SetPushNotificationToken`
  const body = JSON.stringify({ token, pushToken })

  await apiFetchText(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  })
}
