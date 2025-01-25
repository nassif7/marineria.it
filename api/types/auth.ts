export enum UserRole {
  PRO = 'PRO',
  OWNER = 'ARM',
}
export type AuthResponse = {
  category: UserRole
  token: string
}
export type UserAuth = Record<UserRole, string | null>
