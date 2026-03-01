export function getLanguageCode(lang?: string): string {
  return { en: 'ENG', it: 'ITA' }[lang || ''] || 'ENG'
}
