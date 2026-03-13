import { API } from './consts'
import { TRecruiterSearch } from './types'
import { TCrew, TCrewSimple } from './types/crew'
import { apiFetchJson, apiFetchText, getLanguageCode } from './utils'

export const getRecruiterActiveSearches = async (ownerToken: string, language: string): Promise<TRecruiterSearch[]> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${languageCode}`
  return apiFetchJson<TRecruiterSearch[]>(url)
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

export const getCrewList = async (offerId: string, ownerToken: string, language: string): Promise<TCrewSimple[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}?language=${languageCode}`
  return apiFetchJson<TCrewSimple[]>(url)
}

export const getCrewCV = async (ownerToken: string, crewId: string, language?: string): Promise<TCrew> => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/CvUser/${ownerToken}/${crewId}?language=${languageCode}`
  return apiFetchJson<TCrew>(url)
}

export const contactCrew = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
): Promise<string> => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/ContactPro/${ownerToken}/${offerId}/${crewId}?language=${languageCode}`
  return apiFetchText(url)
}

export const removeCrew = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
): Promise<string> => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/RejectPRO/${ownerToken}/${offerId}/${crewId}?language=${languageCode}`
  return apiFetchText(url)
}
