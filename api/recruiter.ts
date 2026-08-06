import { API, BASE_URL } from './consts'
import { TRecruiterSearch } from './types'
import { TCrew, TCrewSimple } from './types/crew'
import { apiFetchJson, apiFetchText, getLanguageCode } from './utils'
import {
  USE_FAKE_DATA,
  fakeGetRecruiterActiveSearches,
  fakeGetRecruiterSearchById,
  fakeGetCrewList,
  fakeGetCrewCv,
  fakeContactCrew,
  fakeRemoveCrew,
} from './fakeData'

export const getRecruiterActiveSearches = async (ownerToken: string, language: string): Promise<TRecruiterSearch[]> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${languageCode}`
  return apiFetchJson<TRecruiterSearch[]>(url)
}

export const getRecruiterActiveSearchesPost = async (
  ownerToken: string,
  language: string
): Promise<TRecruiterSearch[]> => {
  if (USE_FAKE_DATA) return fakeGetRecruiterActiveSearches()
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TRecruiterSearch[] }>(API.OWNER_OFFERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: ownerToken, language: languageCode }),
  })

  return data.items
}

export const getRecruiterSearchById = async (
  searchId: string,
  ownerToken: string,
  language?: string
): Promise<TRecruiterSearch[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.OWNER_OFFERS + `/${ownerToken}/${searchId}?language=${languageCode}`
  return apiFetchJson<TRecruiterSearch[]>(url)
}

export const getRecruiterSearchByIdPost = async (
  searchId: string | number,
  ownerToken: string,
  language?: string
): Promise<TRecruiterSearch[]> => {
  if (USE_FAKE_DATA) return fakeGetRecruiterSearchById(searchId)
  const languageCode = getLanguageCode(language)
  const url = `${API.OWNER_OFFERS}/${searchId}`
  const data = await apiFetchJson<{ items: TRecruiterSearch[] }>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: ownerToken, language: languageCode }),
  })
  return data.items
}

export const getCrewList = async (offerId: string, ownerToken: string, language: string): Promise<TCrewSimple[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}?language=${languageCode}`
  return apiFetchJson<TCrewSimple[]>(url)
}

export const getCrewListPost = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<TCrewSimple[]> => {
  if (USE_FAKE_DATA) return fakeGetCrewList(offerId)
  const languageCode = getLanguageCode(language)
  const data = await apiFetchJson<{ items: TCrewSimple[] }>(`${API.CREW_LIST}/${offerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: ownerToken, language: languageCode }),
  })
  return data.items
}

export const getCrewCV = async (ownerToken: string, crewId: string, language?: string): Promise<TCrew[]> => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/CvUser/${ownerToken}/${crewId}?language=${languageCode}`
  return apiFetchJson<TCrew[]>(url)
}

export const getCrewCvPost = async (
  crewId: string,
  offerId: string,
  ownerToken: string,
  language?: string
): Promise<TCrew> => {
  if (USE_FAKE_DATA) return fakeGetCrewCv(crewId)
  const languageCode = getLanguageCode(language)
  const url = `${BASE_URL}/api/Owneruser/CvUser/${offerId}/${crewId}`
  const body = { userToken: ownerToken, language: languageCode }
  return apiFetchJson<TCrew>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
}

export const contactCrew = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
): Promise<string> => {
  if (USE_FAKE_DATA) return fakeContactCrew(crewId, offerId)
  const languageCode = getLanguageCode(language)
  const url = `${BASE_URL}/api/Owneruser/ContactPro/${offerId}/${crewId}`
  const body = { userToken: ownerToken, language: languageCode }
  return apiFetchText(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
}

export const removeCrew = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
): Promise<string> => {
  if (USE_FAKE_DATA) return fakeRemoveCrew(crewId, offerId)
  const languageCode = getLanguageCode(language)
  const url = `${BASE_URL}/api/Owneruser/RejectPRO/${offerId}/${crewId}`
  return apiFetchText(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ userToken: ownerToken, language: languageCode }),
  })
}
