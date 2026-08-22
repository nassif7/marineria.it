const formatCurrency = (value: string, language?: string): string => {
  if (!value) return ''
  // The API sometimes sends amounts already formatted with the euro sign (e.g. "€ 3.500") —
  // trust that formatting as-is instead of trying to reparse it.
  if (value.includes('€')) return value

  const num = Number(value)
  if (Number.isNaN(num)) return ''
  try {
    return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(num)
  } catch {
    return `€${num}`
  }
}

export const formatSalary = (salaryFrom: string, salaryTo: string, language?: string): string => {
  const from = formatCurrency(salaryFrom, language)
  const to = formatCurrency(salaryTo, language)
  if (!from || !to) return from || to
  if (salaryFrom === salaryTo) return from
  return `${from} – ${to}`
}
