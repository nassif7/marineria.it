import { API } from './consts'
import { TOffer } from './types'
import { apiFetchJson, getLanguageCode } from './utils'
import { USE_FAKE_DATA, fakeGetPublicOffers } from './fakeData'

export const getPublicOffers = async (language?: string): Promise<TOffer[]> => {
  if (USE_FAKE_DATA) return fakeGetPublicOffers(language)
  const languageCode = getLanguageCode(language)
  const url = `${API.PUBLIC_OFFERS}?language=${languageCode}&position=0&elements=0&idoffer=0`
  const data = await apiFetchJson<{ items: TOffer[] }>(url, { method: 'POST' })
  return data.items
}
