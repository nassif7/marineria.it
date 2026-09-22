export const MONTHS_EN = [
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

export const formatDate = (raw: string): string => {
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`
}

// ── Experience parser ──────────────────────────────────────
export const parseExperience = (exp: string, t: (k: string, o?: any) => string): { value: string; suffix: string } => {
  if (!exp) return { value: '—', suffix: '' }
  const yearMatch = exp.match(/(\d+)\s*(?:year|ann)/i)
  const monthMatch = exp.match(/(\d+)\s*(?:month|mes)/i)
  const years = yearMatch ? parseInt(yearMatch[1]) : 0
  const months = monthMatch ? parseInt(monthMatch[1]) : 0
  if (years > 0) {
    const y = months >= 6 ? years + 1 : years
    return { value: String(y), suffix: t(`crew-profile.exp-year`, { count: y }) }
  }
  if (months > 0) return { value: String(months), suffix: t(`crew-profile.exp-month`, { count: months }) }
  return { value: exp, suffix: '' }
}

// ── Completion calculation ─────────────────────────────────
export const COMPLETION_FIELDS = [
  'userPhoto',
  'mainPosition',
  'nationality',
  'city',
  'dateAvailability',
  'salary',
  'educationalLevel',
  'courses',
  'seamansBook',
  'cellular',
  'calculatedExperience',
  'language1',
  'curriculum',
  'ita_yachts_deck',
]

export const calcCompletion = (u: Record<string, any>) => {
  const filled = COMPLETION_FIELDS.filter((k) => !!u[k]).length
  const pct = Math.round((filled / COMPLETION_FIELDS.length) * 100)
  const missing = COMPLETION_FIELDS.length - filled
  return { pct, missing }
}
