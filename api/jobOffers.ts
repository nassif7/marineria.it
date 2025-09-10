import { API } from './const'
import { ProJobOfferType, OwnerJobOfferType } from './types/jobOffer'
import { ErrorResponse } from './types/errors'
import { getLAnguageCode } from './types'

// Get All offers without token
export const getOwnerOffers = async (
  ownerToken: string,
  language: string
): Promise<OwnerJobOfferType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${languageCode}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as OwnerJobOfferType[]
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

// Get owner offer by id
export const getOwnerOfferById = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${languageCode}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

// Get Crew List
export const getCrewList = async (offerId: string, ownerToken: string, language: string): Promise<any> => {
  const languageCode = getLAnguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${languageCode}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as any
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

// Get Pro user All Offers
export const getProUserOffers = async (
  proToken: string,
  allOffers: boolean,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)
  try {
    const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${languageCode}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as ProJobOfferType[]
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

// Get pro user offer by id
export const getProOfferById = async (
  offerId: string,
  proToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)

  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${languageCode}`
  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as ProJobOfferType[]
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

export const applyToOffer = async (
  proToken: string,
  offerId: number,
  language: string
): Promise<ErrorResponse | any> => {
  const languageCode = getLAnguageCode(language)

  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}?language=${languageCode}`

  const response = await fetch(url)
  if (response.ok) {
    const data = await response.json()
    return data as any
  } else {
    return 'something went wrong, please try again later'
  }
}
