import { API } from './const'
import { TOffer } from './types'
import { getLanguageCode } from './utils'

export const getProOffers = async (proToken: string, allOffers?: boolean, language?: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch  job offers (${response.status})`)
  }

  return response.json()
}

export const getProOfferById = async (offerId: string, proToken: string, language: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch  job offer (${response.status})`)
  }

  return response.json()
}

export const applyToOffer = async (proToken: string, offerId: number, language: string): Promise<any> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}?language=${languageCode}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to apply to job offers (${response.status})`)
  }

  return response.json()
}
