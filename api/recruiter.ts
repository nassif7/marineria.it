import { API } from './consts'
import { TRecruiterSearch } from './types'
import { TCrew, TCrewSimple } from './types/crew'
import { getLanguageCode } from './utils'

export const getRecruiterActiveSearches = async (ownerToken: string, language: string): Promise<TRecruiterSearch[]> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}

export const getRecruiterSearchById = async (
  searchId: string,
  ownerToken: string,
  language?: string
): Promise<TRecruiterSearch[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.OWNER_OFFERS + `/${ownerToken}/${searchId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}

export const getCrewList = async (offerId: string, ownerToken: string, language: string): Promise<TCrewSimple[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}

export const getCrewCV = async (ownerToken: string, crewId: string, language?: string): Promise<TCrew> => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/CvUser/${ownerToken}/${crewId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch owner CV (${response.status})`)
  }

  return response.json()
}

export const selectProUser = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
) => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/SelectPro/${ownerToken}/${offerId}/${crewId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to select CV (${response.status})`)
  }

  return response.json()
}

export const declineProUser = async (
  ownerToken: string,
  crewId: string | number,
  offerId: string | number,
  language?: string
) => {
  const languageCode = getLanguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/RejectPRO/${ownerToken}/${offerId}/${crewId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to delete CV (${response.status})`)
  }

  return response.json()
}
