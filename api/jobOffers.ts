import { API } from './const'
import { ProJobOfferType, OwnerJobOfferType } from './types/jobOffer'
import { CrewType } from './types/crew'
import { ErrorResponse } from './types/errors'
import { getLAnguageCode } from './types'
import { Languages } from 'lucide-react-native'

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
export const getCrewList = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<CrewType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}?language=${languageCode}`

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

export const getCrewCV = async (
  ownerToken: string,
  crewId: string,
  language?: string
): Promise<CrewType[] | ErrorResponse> => {
  const languageCode = getLAnguageCode(language)
  const url = `https://www.comunicazione.it/api/Owneruser/CvUser/${ownerToken}/${crewId}?language=${languageCode}`

  const response = await fetch(url)

  const data = await response.json()

  if (response.ok) {
    return data
  } else {
    return data as ErrorResponse
  }
}

export const selectProUser = async (ownerToken: string, crewId: string | number, offerId: string | number) => {
  const url = `https://www.comunicazione.it/api/Owneruser/SelectPro/${ownerToken}/${offerId}/${crewId}?language=ENG`

  console.log(url)
  const response = await fetch(url)
  console.log(response)
  const data = await response.json()

  if (response.ok) {
    return data
  } else {
    return data as ErrorResponse
  }
}

export const rejectProUser = async (ownerToken: string, crewId: string | number, offerId: string | number) => {
  const url = `https://www.comunicazione.it/api/Owneruser/RejectPRO/${ownerToken}/${offerId}/${crewId}?language=ENG`

  const response = await fetch(url)

  console.log(response)
  const data = await response.json()

  if (response.ok) {
    return data
  } else {
    return data as ErrorResponse
  }
}
