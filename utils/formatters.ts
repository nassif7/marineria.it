const formatCurrency = (value: string, language?: string): string => {
  const num = Number(value)
  if (!value || Number.isNaN(num)) return ''
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
