export * as AuthTypes from './auth'
export * as ErrorTypes from './errors'
export * from './offer'
export * as UserTypes from './user'
export * from './search'
export * from './crew'

export { TCrew as CrewType } from './crew'

import { ErrorResponse } from './errors'

export function isErrorResponse(data: ErrorResponse | any): data is ErrorResponse {
  return (data as ErrorResponse).status !== undefined
}

export function getLanguageCode(lang?: string): string {
  return { en: 'ENG', it: 'ITA' }[lang || ''] || 'ENG'
}
