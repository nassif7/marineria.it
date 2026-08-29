import { TCrew, TCrewSimple } from '@/api/types'

export const getCertificateOfCompetence = (crew: TCrew | TCrewSimple) => {
  const certificateOfCompetence = [
    crew.ita_yachts_deck,
    crew.ita_yachts_engine,
    crew.mca_yachts_deck,
    crew.mca_deck_rya,
    crew.stcw_navy_deck,
    crew.stcw_navy_engine,
  ].filter(Boolean)

  const hasCertificateOfCompetence = !!certificateOfCompetence.length

  return {
    hasCertificateOfCompetence,
    certificateOfCompetence,
  }
}

// crew.seamansBook is always populated with a fixed label — "Seamans Book" (EN) or "Libretto di
// Navigazione" (IT) — depending on the request's language, not an empty string when absent.
const SEAMANS_BOOK_VALUES = ['Seamans Book', 'Libretto di Navigazione']
export const getSeamansBook = (crew: TCrew | TCrewSimple) => {
  return SEAMANS_BOOK_VALUES.includes(crew.seamansBook)
}

// crew.courses is one free-text string ending in a count like "(4 courses)" / "(4 corsi)",
// not a comma-separated list — pull the count from that suffix instead of splitting on commas.
export const getCoursesCount = (courses?: string | null): number => {
  if (!courses) return 0
  const match = courses.match(/\((\d+)\s*(?:courses?|cors[oi])\)/i)
  if (match) return parseInt(match[1], 10)
  return courses
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean).length
}

// crew.availability is free text (e.g. "Not available at the moment" / "Non disponibile al momento"),
// so a plain "available"/"disponibil" substring match wrongly flags the negative case too.
export const isCrewAvailable = (availability?: string | null): boolean => {
  if (!availability) return false
  const value = availability.toLowerCase()
  if (value.includes('not available') || value.includes('non disponibil')) return false
  return value.includes('available') || value.includes('disponibil')
}
