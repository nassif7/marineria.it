import { API } from './const'
import { AuthResponse } from '@/api/types/auth'

export const signIn = async (username: string, password: string): Promise<AuthResponse | Error> => {
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
    return new Error(`Failed to login (${response.status})`)
  }

  return response.json()
}
