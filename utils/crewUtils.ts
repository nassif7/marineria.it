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

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTHS_IT = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
]

// crew.dateAvailability comes from the backend pre-formatted as "dd MonthName yyyy", in either
// English or Italian depending on the request's language (e.g. "01 January 0001" for an unset
// value — that's .NET's DateTime.MinValue). It's occasionally also "dd/mm/yyyy" in fake/dev data.
// `new Date(raw)` alone misparses all of these, so try each explicitly.
export const parseCrewAvailabilityDate = (raw?: string | null): Date | null => {
  if (!raw) return null
  const trimmed = raw.trim()

  const monthNameMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-zàèéìòù]+)\s+(\d{1,4})$/)
  if (monthNameMatch) {
    const [, dd, monthName, yyyy] = monthNameMatch
    const monthNameLower = monthName.toLowerCase()
    const monthIndex = MONTHS_EN.findIndex((m) => m.toLowerCase() === monthNameLower)
    const monthIndexIt = MONTHS_IT.findIndex((m) => m === monthNameLower)
    const resolvedMonthIndex = monthIndex !== -1 ? monthIndex : monthIndexIt
    if (resolvedMonthIndex !== -1) {
      const d = new Date(Number(yyyy), resolvedMonthIndex, Number(dd))
      return isNaN(d.getTime()) ? null : d
    }
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, dd, mm, yyyy] = slashMatch
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return isNaN(d.getTime()) ? null : d
  }

  const fallback = new Date(trimmed)
  return isNaN(fallback.getTime()) ? null : fallback
}

export const formatCrewDate = (date: Date, language?: string): string => {
  const months = language?.toLowerCase().startsWith('it') ? MONTHS_IT : MONTHS_EN
  return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export type TCrewAvailability = {
  isAvailable: boolean
  date: Date | null
  description: string
  status: 'available' | 'expired' | 'not-available'
}

type TFunction = (key: string, options?: Record<string, unknown>) => string

// Italian word ending for gendered strings, e.g. "trovat{{genderEnding}}" → "trovata" / "trovato".
// The backend localizes gender with the request language ("Female" in EN, "Femmina"/"F" in IT),
// so match any female form rather than the English value only.
export const getGenderEnding = (gender?: string | null) => (/^(f|donna)/i.test(gender?.trim() ?? '') ? 'a' : 'o')

export const getCrewAvailability = (
  availability: boolean,
  rawDate: string | null | undefined,
  language: string | undefined,
  t: TFunction,
  gender?: string | null
): TCrewAvailability => {
  const date = parseCrewAvailabilityDate(rawDate)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const isPast = !!date && date.getTime() < todayStart.getTime()

  if (isPast) {
    return {
      isAvailable: false,
      date,
      status: 'expired',
      description: t('crew-profile.availability-expired', { ns: 'home-screen', genderEnding: getGenderEnding(gender) }),
    }
  }

  if (!availability || !date) {
    return {
      isAvailable: false,
      date,
      status: 'not-available',
      description: t('crew-profile.availability-toggle-sub', { ns: 'home-screen' }),
    }
  }

  return {
    isAvailable: true,
    date,
    status: 'available',
    description: t('crew-profile.action-availability-sub', { ns: 'home-screen', date: formatCrewDate(date, language) }),
  }
}

type TCrewPhotoFields = {
  userPhoto?: string | null
  namephotoA?: string | null
  namephotoB?: string | null
  namephotoC?: string | null
}

// The backend sometimes returns the same photo in more than one field, with different casing
// (e.g. "6645103082026160148_a" and "6645103082026160148_A") — dedupe case-insensitively,
// ignoring the extension, and keep the first occurrence's original spelling.
export const getCrewPhotos = (crew: TCrewPhotoFields): string[] => {
  const seen = new Set<string>()
  return [crew.userPhoto, crew.namephotoA, crew.namephotoB, crew.namephotoC].filter((p): p is string => {
    const key = p
      ?.trim()
      .replace(/\.(jpe?g|png|gif|webp)$/i, '')
      .toLowerCase()
    if (!p || !key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// When to remind the crew that their availability date has expired: 11:00 the day after the date,
// then weekly at the same time while it stays expired. Only future slots are returned — for a
// date that expired long ago that's the next weekly slot onward, never a burst of missed ones.
// Capped at `count` because local notifications can't repeat from a start date; the batch is
// rescheduled every time availability loads, so an app open tops it back up.
export const getAvailabilityReminderDates = (availableDate: Date, now = new Date(), count = 8): Date[] => {
  const first = new Date(availableDate)
  first.setDate(first.getDate() + 1)
  first.setHours(11, 0, 0, 0)
  const dates: Date[] = []
  for (let week = 0; dates.length < count; week++) {
    const d = new Date(first)
    d.setDate(first.getDate() + week * 7)
    if (d.getTime() > now.getTime()) dates.push(d)
  }
  return dates
}
