import * as SecureStore from 'expo-secure-store'
import { TUserRole } from '@/api/types'

const storageKey = (role: TUserRole) => `pushToken:${role}`

export const getLocalPushToken = (role: TUserRole) => SecureStore.getItemAsync(storageKey(role))

export const setLocalPushToken = (role: TUserRole, pushToken: string) =>
  SecureStore.setItemAsync(storageKey(role), pushToken)

export const clearLocalPushToken = (role: TUserRole) => SecureStore.deleteItemAsync(storageKey(role))
