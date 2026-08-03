export const BASE_URL = 'https://www.comunicazione.it'

const PHOTOS_BASE_URL = process.env.EXPO_PUBLIC_PHOTOS_BASE_URL ?? 'https://test.marineria.it'
// TODO: point back to www.marineria.it before release
const WEB_URL = 'https://test.marineria.it'

export const getPhotoUrl = (filename: string) =>
  /^https?:\/\//.test(filename) ? filename : `${PHOTOS_BASE_URL}/PROFoto/${filename}.jpg`

// Public, unauthenticated page — safe to hand out to anyone the offer is shared with.
export const getOfferShareUrl = (idoffer: number, language?: string) =>
  language === 'en' ? `${WEB_URL}/en/apply.aspx?idofferta=${idoffer}` : `${WEB_URL}/It/Apply.aspx/${idoffer}`

export const API = {
  LOGIN: `${BASE_URL}/api/login`,
  CHECK_EMAIL: `${BASE_URL}/api/Login/ChekEmail`,
  LOGIN_CODE: `${BASE_URL}/api/Login/LoginCode`,
  GET_TMP_CODE: `${BASE_URL}/api/Login/GetTmpCode`,
  PROFILE: `${BASE_URL}/api`,
  NOTIFICATION: `${BASE_URL}/api/PushNotification`,
  OWNER_OFFERS: `${BASE_URL}/api/Owneruser/Offers`,
  CREW_LIST: `${BASE_URL}/api/Owneruser/CrewList`,
  PRO_OFFERS: `${BASE_URL}/api/OffersForProuserApply`,
  WHY_CANT_APPLY: `${BASE_URL}/api/OffersForProuserApply/WhyCanNotApply`,
  PUBLIC_OFFERS: `${BASE_URL}/api/Offers`,
  PROUSER_CV: `${BASE_URL}/api/Prouser/Cv`,
}
