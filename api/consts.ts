export const BASE_URL = 'https://www.comunicazione.it'

const PHOTOS_BASE_URL = process.env.EXPO_PUBLIC_PHOTOS_BASE_URL ?? 'https://test.marineria.it'

export const getPhotoUrl = (filename: string) => `${PHOTOS_BASE_URL}/PROFoto/${filename}.jpg`

export const API = {
  LOGIN: `${BASE_URL}/api/login`,
  CHECK_EMAIL: `${BASE_URL}/api/Login/ChekEmail`,
  LOGIN_CODE: `${BASE_URL}/api/Login/LoginCode`,
  PROFILE: `${BASE_URL}/api`,
  NOTIFICATION: `${BASE_URL}/api/PushNotification`,
  OWNER_OFFERS: `${BASE_URL}/api/Owneruser/Offers`,
  CREW_LIST: `${BASE_URL}/api/Owneruser/CrewList`,
  PRO_OFFERS: `${BASE_URL}/api/OffersForProuserApply`,
  WHY_CANT_APPLY: `${BASE_URL}/api/OffersForProuserApply/WhyCanNotApply`,
  PUBLIC_OFFERS: `${BASE_URL}/api/Offers`,
}
