import { API } from './const'
import { ProJobOfferType } from './types/jobOffer'
import { getLanguageCode } from './types'

export const getProOffers = async (
  proToken: string,
  allOffers?: boolean,
  language?: string
): Promise<ProJobOfferType[] | Error> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to fetch  job offers (${response.status})`)
  }

  return response.json()
}

export const getProOfferById = async (
  offerId: string,
  proToken: string,
  language: string
): Promise<ProJobOfferType[] | Error> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to fetch  job offer (${response.status})`)
  }

  return response.json()
}

export const applyToOffer = async (proToken: string, offerId: number, language: string): Promise<any | Error> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    return new Error(`Failed to apply to job offers (${response.status})`)
  }

  return response.json()
}
