export type ErrorResponse = {
  code?: number
  messageKey?: string
  details?: any
  [key: string]: any // Allow additional properties
}
