import { API } from './const'
import { AuthResponse } from '@/api/types/auth'
import { ErrorResponse } from '@/api/types/errors'

export const signIn = async (username: string, password: string): Promise<AuthResponse | ErrorResponse> => {
  const formData = JSON.stringify({
    username,
    password,
  })
  console.log('here', username, password)
  try {
    const response = await fetch(API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: formData,
    })

    console.log('response', response)
    if (response.ok) {
      const data = await response.json()
      return data as AuthResponse
    } else {
      return {
        code: response.status,
        messageKey: 'login_error',
      }
    }
  } catch (error) {
    return {
      code: 0,
      messageKey: 'login_error',
    }
  }
}
