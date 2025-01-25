export * as AuthTypes from './auth'
export * as ErrorTypes from './errors'
export * as JobOfferTypes from './jobOffer'
export * as UserTypes from './user'

import { ErrorResponse } from './errors'

export function isErrorResponse(data: ErrorResponse | any): data is ErrorResponse {
  return (data as ErrorResponse).status !== undefined
}
