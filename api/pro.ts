import { API } from './consts'
import { TOffer } from './types'
import { apiFetchJson, getLanguageCode } from './utils'

export const getProOffers = async (proToken: string, allOffers?: boolean, language?: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `${allOffers ? '/AllOffers' : ''}/${proToken}?language=${languageCode}`
  return apiFetchJson<TOffer[]>(url)
}

export const getProOfferById = async (offerId: string, proToken: string, language: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/${offerId}/${proToken}?language=${languageCode}`
  return apiFetchJson<TOffer[]>(url)
}

export const applyToOffer = async (proToken: string, offerId: number, language: string): Promise<any> => {
  const languageCode = getLanguageCode(language)
  const url = API.PRO_OFFERS + `/Apply/${offerId}/${proToken}?language=${languageCode}`
  return apiFetchJson(url)
}

type WhyCanNotApplyResponse = {
  message: string
  reason: string | string[]
}

export const getWhyCanNotApply = async (offerId: number, proToken: string, language: string): Promise<string[]> => {
  const languageCode = getLanguageCode(language)
  const url = API.WHY_CANT_APPLY + `/${offerId}/${proToken}?Language=${languageCode}`
  const data = await apiFetchJson<WhyCanNotApplyResponse>(url)
  return Array.isArray(data.reason) ? data.reason : [data.reason]
}
