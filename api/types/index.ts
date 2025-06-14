export * as AuthTypes from './auth'
export * as ErrorTypes from './errors'
export * as NetworkTypes from './network'
export * as JobOfferTypes from './jobOffer'
export * as UserTypes from './user'
export { CrewType } from './crew'

import { ErrorResponse } from './errors'

export const LanguageCode: Record<string, string> = {
  en: 'ENG',
  it: 'ITA',
}

export function isErrorResponse(data: ErrorResponse | any): data is ErrorResponse {
  return (data as ErrorResponse).code !== undefined
}
