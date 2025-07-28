import { API } from './const'
import { ProJobOfferType, OwnerJobOfferType } from './types/jobOffer'
import { CrewType } from './types/crew'
import { ErrorResponse } from './types/errors'
import { SuccessResponse } from '@/api/types/network'
import { LanguageCode } from './types'

// Get All offers without token
export const getOwnerOffers = async (
  ownerToken: string,
  language: string
): Promise<OwnerJobOfferType[] | ErrorResponse> => {
  const url = `${API.OWNER_OFFERS}/${ownerToken}?language=${LanguageCode[language] || LanguageCode.en}`
  try {
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      return data as OwnerJobOfferType[]
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_offers_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'fetching_offers_error',
    }
  }
}

// Get owner offer by id
export const getOwnerOfferById = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${LanguageCode[language] || LanguageCode.en}`

  try {
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return data as ProJobOfferType[]
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_offers_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'fetching_offers_error',
    }
  }
}

// Get Crew List
export const getCrewList = async (
  offerId: string,
  ownerToken: string,
  language: string
): Promise<CrewType[] | ErrorResponse> => {
  const url = API.CREW_LIST + `/${ownerToken}/${offerId}/${LanguageCode[language] || LanguageCode.en}`

  try {
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return data as CrewType[]
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_crew_list_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'fetching_crew_list_error',
    }
  }
}

// Get Pro user All Offers
export const getProUserOffers = async (
  proToken: string,
  allOffers: boolean,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  console.log(proToken, language)
  const url =
    API.PRO_OFFERS +
    `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${LanguageCode[language] || LanguageCode.en}`

  console.log(url)
  try {
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return data as ProJobOfferType[]
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_offers_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'fetching_offers_error',
    }
  }
}

// Get pro user offer by id
export const getProOfferById = async (
  offerId: string,
  proToken: string,
  language: string
): Promise<ProJobOfferType[] | ErrorResponse> => {
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${LanguageCode[language] || LanguageCode.en}`
  try {
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      return data as ProJobOfferType[]
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_offer_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'fetching_offer_error',
    }
  }
}

export const applyToOffer = async (
  proToken: string,
  offerId: number,
  language: string
): Promise<ErrorResponse | SuccessResponse> => {
  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}`

  try {
    const response = await fetch(url)
    if (response.ok) {
      return {
        messageKey: 'offer_applied_successfully',
      }
    } else {
      return {
        code: response.status,
        messageKey: 'offer_apply_error',
      }
    }
  } catch (e) {
    return {
      code: 0,
      messageKey: 'offer_apply_error',
    }
  }
}
