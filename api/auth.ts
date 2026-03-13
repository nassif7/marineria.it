import { API } from './consts'
import { TAuthResponse } from '@/api/types/auth'
import { apiFetchJson } from './utils'

export const signIn = async (username: string, password: string): Promise<TAuthResponse> => {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json; charset=utf-8',
  }
  const requestBody = JSON.stringify({
    username,
    password,
  })

  return apiFetchJson<TAuthResponse>(API.LOGIN, {
    method: 'POST',
    headers: requestHeaders,
    body: requestBody,
  })
}
