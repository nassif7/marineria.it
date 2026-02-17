export enum UserRole {
  CREW = 'PRO',
  RECRUITER = 'ARM',
}
export type AuthResponse = {
  category: UserRole
  token: string
}
export type UserAuth = Record<UserRole, string | null>
