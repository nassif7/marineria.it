import { API } from './const'
import { UserRole } from '@/api/types/auth'
import { User } from '@/api/types/user'
import { ErrorResponse } from '@/api/types/errors'
import { SuccessResponse } from '@/api/types/network'
import { LanguageCode } from '@/api/types'

export const getUserProfile = async (
  token: string,
  role: UserRole,
  language: string
): Promise<User | ErrorResponse> => {
  const userRole = role == UserRole.OWNER ? 'Owneruser' : 'Prouser'

  try {
    const response = await fetch(
      `${API.PROFILE}/${userRole}/${token}?lang=${LanguageCode[language] || LanguageCode.en}`
    )
    if (response.ok) {
      const data = await response.json()
      return data as User
    } else {
      return {
        code: response.status,
        messageKey: 'fetching_profile_error',
      } as ErrorResponse
    }
  } catch (error) {
    return {
      code: 0,
      messageKey: 'fetching_profile_error',
    } as ErrorResponse
  }
}

export const setNotificationToken = async (
  token: string,
  pushToken: string
): Promise<SuccessResponse | ErrorResponse> => {
  const formData = JSON.stringify({
    token,
    pushToken,
  })
  try {
    const response = await fetch(`${API.NOTIFICATION}/SetPushNotificationToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: formData,
    })
    if (response.ok) {
      return {
        messageKey: 'notification_token_set',
      }
    } else {
      return {
        code: response.status,
        messageKey: 'notification_token_set_error',
      }
    }
  } catch (error) {
    return {
      code: 0,
      messageKey: 'notification_token_set_error',
    } as ErrorResponse
  }
}
