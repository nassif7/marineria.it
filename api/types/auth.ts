export enum TUserRole {
  PRO = 'PRO',
  RECRUITER = 'ARM',
}
export type TAuthResponse = {
  category: TUserRole
  token: string
}
export type TUserAuth = Record<TUserRole, string | null>
