import { API } from './const'
import { JobOfferType } from './types/jobOffer'
import { ErrorResponse } from './types/errors'

// Get All offers without token
export const getOwnerOffers = async (
  language: string,
  ownerToken?: string,
): Promise<JobOfferType[] | ErrorResponse> => {
  const url = `${API.OWNER_OFFERS}${ownerToken ? `/${ownerToken}` : ''}?language=${language}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as JobOfferType[]
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
  language: string,
): Promise<JobOfferType[] | ErrorResponse> => {
  const url = API.OWNER_OFFERS + `/${offerId}/${ownerToken}?language=${language}`
  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as JobOfferType[]
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
  language: string,
  allOffers?: boolean,
): Promise<JobOfferType[] | ErrorResponse> => {
  try {
    const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${language}`

    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as JobOfferType[]
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
  language: string,
): Promise<JobOfferType[] | ErrorResponse> => {
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${language}`
  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      return data as JobOfferType[]
    } else {
      return data as ErrorResponse
    }
  } catch (e) {
    throw e
  }
}

export const applyToOffer = async (
  proToken: string,
  offerId: string,
  language: string,
): Promise<ErrorResponse | any> => {
  const url = API.PRO_OFFERS + `apply/${offerId}/${proToken}`
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
