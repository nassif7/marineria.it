import { API } from './const'
import { ProJobOfferType, OwnerSearchType } from './types/jobOffer'
import { CrewType } from './types/crew'
import { getLanguageCode } from './types'

export const getRecruiterActiveSearches = async (
  ownerToken: string,
  language: string
): Promise<OwnerSearchType[] | Error> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}

export const getRecruiterSearchById = async (
  searchId: string,
  ownerToken: string,
  language?: string
): Promise<OwnerSearchType[] | Error> => {
  const languageCode = getLanguageCode(language)
  const url = API.OWNER_OFFERS + `/${ownerToken}/${searchId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}

export const getCrewList = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<CrewType[] | Error> => {
  const languageCode = getLanguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to fetch owner job offers (${response.status})`)
  }

  return response.json()
}
