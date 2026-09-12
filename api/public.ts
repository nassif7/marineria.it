import { API } from './consts'
import { TOffer } from './types'
import { apiFetchJson, getLanguageCode } from './utils'
import { USE_FAKE_DATA, fakeGetPublicOffers, fakeGetOfferById } from './fakeData'

// idoffer 0 means "all offers" on this endpoint; passing a real id filters to just that one,
// which the deep-link landing screen relies on when it opens directly on a single offer that
// isn't already sitting in the public-offers list cache.
export const getPublicOffers = async (language?: string, idoffer = 0): Promise<TOffer[]> => {
  if (USE_FAKE_DATA) return idoffer ? fakeGetOfferById(idoffer, language) : fakeGetPublicOffers(language)
  const languageCode = getLanguageCode(language)
  const url = `${API.PUBLIC_OFFERS}?language=${languageCode}&position=0&elements=0&idoffer=${idoffer}`
  const data = await apiFetchJson<{ items: TOffer[] }>(url, { method: 'POST' })
  return data.items
}
