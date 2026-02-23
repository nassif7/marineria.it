export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()

  return `${dd < 10 ? '0' + dd : dd}/${mm < 10 ? '0' + mm : mm}/${yyyy}`
}

export const getAge = (birthDate: string): number => {
  const today = new Date()
  const birthDateObj = new Date(birthDate)
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }

  return age
}

export const getAgeByYear = (birthYear: string): number => {
  const today = new Date()
  const birthYearObj = new Date(birthYear)
  let age = today.getFullYear() - birthYearObj.getFullYear()

  return age
}
export const isDateString = (str: string): boolean => {
  if (typeof str !== 'string' || !str.trim()) return false

  const s = str.trim()
  const sLower = s.toLowerCase()

  if (s.length < 6) return false
  if (/^\d+$/.test(s)) return false // just numbers
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return false // just time "14:30"

  const parsed = new Date(s)
  if (!isNaN(parsed.getTime())) {
    // Filter obvious false positives that Date() accepts
    if (
      /^\d{1,4}$/.test(s) || // "2026", "45"
      sLower === '0' ||
      sLower === '1' ||
      sLower.includes('version') ||
      !/\d/.test(s) // no digits at all
    ) {
      return false
    }
    return true
  }

  const italianMonths =
    'gennaio|gen|febbraio|feb|marzo|mar|aprile|apr|maggio|mag|giugno|giu|luglio|lug|agosto|ago|settembre|set|ottobre|ott|novembre|nov|dicembre|dic'
  const englishMonths =
    'january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec'

  const monthRegex = new RegExp(`(${italianMonths}|${englishMonths})`, 'i')

  // Common patterns we accept
  const patterns = [
    // Numeric formats (both MM/DD and DD/MM)
    /\d{1,2}[./-]\d{1,2}[./-]\d{2,4}/,
    // ISO
    /\d{4}-\d{1,2}-\d{1,2}/,
    // Day + month name + optional year
    /\d{1,2}\s+(?:di\s+)?(?:${italianMonths}|${englishMonths})\b/i,
    // Weekday + comma + day + month + year
    /(?:domenica|luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*,?\s*\d{1,2}\s+(?:${italianMonths}|${englishMonths})/i,
  ]

  // At least one pattern must match AND we need month or year context
  const hasPattern = patterns.some((p) => p.test(s))
  const hasMonthOrStrongNumeric =
    monthRegex.test(sLower) ||
    /\d{4}/.test(s) ||
    (/\d{1,2}[./-]\d{1,2}[./-]\d{2,4}/.test(s) && s.split(/[./-]/).length === 3)

  return hasPattern && hasMonthOrStrongNumeric
}
