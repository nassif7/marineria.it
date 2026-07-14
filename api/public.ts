import { API } from './consts'
import { TOffer } from './types'
import { apiFetchJson, getLanguageCode } from './utils'

export const getPublicOffers = async (language?: string): Promise<TOffer[]> => {
  const languageCode = getLanguageCode(language)
  const url = `${API.PUBLIC_OFFERS}?language=${languageCode}&position=0&elements=0&idoffer=0`
  const data = await apiFetchJson<{ items: TOffer[] }>(url, { method: 'POST' })
  return data.items
}
