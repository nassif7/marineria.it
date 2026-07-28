import { API } from './consts'
import { TOffer, TNotification, TCrew } from './types'
import { apiFetchJson, apiFetchText, getLanguageCode } from './utils'
import {
  USE_FAKE_DATA,
  fakeGetAllOffers,
  fakeGetOffersForApply,
  fakeGetOfferById,
  fakeApplyToOffer,
  fakeGetWhyCanNotApply,
  fakeGetNotifications,
  fakeSetNotificationRead,
} from './fakeData'

export const getProOffers = async (proToken: string, allOffers?: boolean, language?: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${languageCode}`
  return apiFetchJson<TOffer[]>(url)
}

export const getProOfferByIdPost = async (offerId: string, token: string, language: string): Promise<TOffer[]> => {
  if (USE_FAKE_DATA) return fakeGetOfferById(offerId)
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TOffer[] }>(API.PRO_OFFERS + `/SingleOffer/${offerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  return data.items
}

export const getProOfferById = async (offerId: string, proToken: string, language: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${languageCode}`
  return apiFetchJson<TOffer[]>(url)
}

export const applyToOffer = async (proToken: string, offerId: number, language: string): Promise<any> => {
  if (USE_FAKE_DATA) return fakeApplyToOffer(offerId)
  const languageCode = getLanguageCode(language)
  return apiFetchJson(API.PRO_OFFERS + `/Apply/${offerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: proToken, language: languageCode }),
  })
}

export const getAllOffersPost = async (token: string, language?: string): Promise<TOffer[]> => {
  if (USE_FAKE_DATA) return fakeGetAllOffers()
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TOffer[] }>(API.PRO_OFFERS + '/AllOffers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  return data.items
}

export const getOffersForApplyPost = async (token: string, language?: string): Promise<TOffer[]> => {
  if (USE_FAKE_DATA) return fakeGetOffersForApply()
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TOffer[] }>(API.PRO_OFFERS + '/OffersForApply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: token, language: languageCode }),
  })
  return data.items
}

type WhyCanNotApplyResponse = {
  message: string
  reason: string | string[]
}

export const getWhyCanNotApply = async (offerId: number, proToken: string, language: string): Promise<string[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.WHY_CANT_APPLY + `/${offerId}/${proToken}?Language=${languageCode}`
  const data = await apiFetchJson<WhyCanNotApplyResponse>(url)
  return Array.isArray(data.reason) ? data.reason : [data.reason]
}

export const getWhyCanNotApplyPost = async (offerId: number, proToken: string, language: string): Promise<string[]> => {
  if (USE_FAKE_DATA) return fakeGetWhyCanNotApply()
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<WhyCanNotApplyResponse>(API.WHY_CANT_APPLY + `/${offerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: proToken, language: languageCode }),
  })
  return Array.isArray(data.reason) ? data.reason : [data.reason]
}

export const getCrewPublicCv = async (userId: number | string, language?: string): Promise<TCrew> => {
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TCrew }>(`${API.PROUSER_CV}/${userId}?language=${languageCode}`)
  return data.items
}

export const getCrewNotifications = async (
  token: string,
  role: 'crew' | 'recruiter' = 'crew'
): Promise<TNotification[]> => {
  if (USE_FAKE_DATA) return fakeGetNotifications(role)
  try {
    const data = await apiFetchJson<TNotification[] | TNotification>(`${API.NOTIFICATION}/GetNotifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ token }),
    })
    return Array.isArray(data) ? data : data ? [data] : []
  } catch {
    return []
  }
}

export const setNotificationRead = async (notificationId: number, token: string): Promise<void> => {
  if (USE_FAKE_DATA) return fakeSetNotificationRead(notificationId)
  await apiFetchText(`${API.NOTIFICATION}/setNotificationRead?notificationId=${notificationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ token }),
  })
}
