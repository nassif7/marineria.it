import { TOffer } from '@/api/types'

// The offers endpoints return both `offer` (Italian) and `offerEng` (English) in every
// response regardless of the request's `language` param — pick the one matching the
// app's current language instead of always showing the Italian text.
export const getLocalizedOfferTitle = (offer: TOffer, language: string) => {
  const localized = language === 'en' ? offer.offerEng : offer.offer
  return localized?.trim() || offer.offer?.trim() || offer.offerEng?.trim() || offer.title
}
