import { API } from './const'
import { AuthResponse } from '@/api/types/auth'
import { ErrorResponse } from '@/api/types/errors'

export const signIn = async (
  username: string,
  password: string,
): Promise<AuthResponse | ErrorResponse> => {
  const formData = JSON.stringify({
    username,
    password,
  })
  try {
    const response = await fetch(API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      return data as AuthResponse
    } else {
      return data as ErrorResponse
    }
  } catch (error: any) {
    throw new Error(`HTTP error! Status: ${error.status}`)
  }
}
