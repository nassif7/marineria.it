import { API } from './consts'
import { TAuthResponse } from '@/api/types/auth'
import { apiFetchJson } from './utils'
import { USE_FAKE_DATA, fakeCheckEmail, fakeAuthenticate } from './fakeData'

export interface ICheckEmailResponse {
  result: number
  categoryPro: string | null
  categoryArm: string | null
  codePRO: string | null
  codeARM: string | null
}

export const checkEmail = async (username: string): Promise<ICheckEmailResponse> => {
  if (USE_FAKE_DATA) return fakeCheckEmail()
  return apiFetchJson<ICheckEmailResponse>(API.CHECK_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ username }),
  })
}

export const loginCode = async (username: string, code: string): Promise<TAuthResponse> => {
  if (USE_FAKE_DATA) return fakeAuthenticate(username)
  return apiFetchJson<TAuthResponse>(API.LOGIN_CODE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify({ username, code }),
  })
}

export const signIn = async (username: string, password: string): Promise<TAuthResponse> => {
  if (USE_FAKE_DATA) return fakeAuthenticate(username)
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
