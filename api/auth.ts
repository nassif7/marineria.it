import { API } from './consts'
import { TAuthResponse } from '@/api/types/auth'

export const signIn = async (username: string, password: string): Promise<TAuthResponse> => {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json; charset=utf-8',
  }
  const requestBody = JSON.stringify({
    username,
    password,
  })

  const response = await fetch(API.LOGIN, {
    method: 'POST',
    headers: requestHeaders,
    body: requestBody,
  })

  if (!response.ok) {
    throw new Error(`Failed to login (${response.status})`)
  }

  return response.json()
}
