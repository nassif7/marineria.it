import { API } from './consts'
import { TAuthResponse } from '@/api/types/auth'
import { apiFetchJson } from './utils'

export interface ICheckEmailResponse {
  result: number
  categoryPro: string | null
  categoryArm: string | null
  codePRO: string | null
  codeARM: string | null
}

export const checkEmail = async (username: string): Promise<ICheckEmailResponse> =>
  apiFetchJson<ICheckEmailResponse>(API.CHECK_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'text/plain' },
    body: JSON.stringify({ username }),
  })

export const loginCode = async (username: string, code: string): Promise<TAuthResponse> =>
  apiFetchJson<TAuthResponse>(API.LOGIN_CODE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify({ username, code }),
  })

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
