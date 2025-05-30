import { API } from './const'
import { ProJobOfferType } from './types/jobOffer'
import { ErrorResponse } from './types/errors'

// Get All offers without token
export const getOwnerOffers = async (
  ownerToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${language}`

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

// Get owner offer by id
export const getOwnerOfferById = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${language}`

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
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${language}`

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
  try {
    const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${language}`

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
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${language}`
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
  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}}`
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
