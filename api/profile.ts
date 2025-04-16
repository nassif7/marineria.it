import { API } from './const'
import { UserRole } from '@/api/types/auth'
import { User } from '@/api/types/user'
import { ErrorResponse } from '@/api/types/errors'

export const getUserProfile = async (
  token: string,
  role: UserRole,
  language: string
): Promise<User | ErrorResponse> => {
  const userRole = role == UserRole.OWNER ? 'Owneruser' : 'Prouser'

  try {
    const response = await fetch(`${API.PROFILE}/${userRole}/${token}/${language}?lang=${language}`)

    const data = await response.json()
    if (response.ok) {
      return data as User
    } else {
      return data as ErrorResponse
    }
  } catch (error) {
    throw error
  }
}

export const setNotificationToken = async (token: string, pushToken: string): Promise<any> => {
  const formData = JSON.stringify({
    token,
    pushToken,
  })

  try {
    const res = await fetch(`${API.NOTIFICATION}/SetPushNotificationToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: formData,
    })
  } catch (e) {
    console.log('first', e)
  }
}
