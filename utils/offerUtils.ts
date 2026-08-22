import { TOffer } from '@/api/types'

// The offers endpoints return both `offer` (Italian) and `offerEng` (English) in every
// response regardless of the request's `language` param — pick the one matching the
// app's current language instead of always showing the Italian text.
export const getLocalizedOfferTitle = (offer: TOffer, language: string) => {
  const localized = language === 'en' ? offer.offerEng : offer.offer
  return localized?.trim() || offer.offer?.trim() || offer.offerEng?.trim() || offer.title
}

// date_start_boarding/date_end_boarding come back null on real offers — the actual
// boarding info lives in the single `boarding` field instead, so fall back to it.
export const getOfferBoardingDisplay = (offer: TOffer) => {
  const range = [offer.date_start_boarding, offer.date_end_boarding].filter(Boolean).join(' – ')
  return range || offer.boarding?.trim() || ''
}
