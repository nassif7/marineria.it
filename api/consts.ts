export const BASE_URL = 'https://www.comunicazione.it'

const PHOTOS_BASE_URL = process.env.EXPO_PUBLIC_PHOTOS_BASE_URL ?? 'https://www.marineria.it'
// TODO: point back to www.marineria.it before release
const WEB_URL = 'https://wwww.marineria.it'

export const getPhotoUrl = (filename: string) => {
  if (/^https?:\/\//.test(filename)) return filename
  // The backend sometimes already includes the extension in the filename (e.g. "55881.jpg"),
  // so appending ".jpg" unconditionally produced double-extension URLs like "55881.jpg.jpg".
  const hasExtension = /\.(jpe?g|png|gif|webp)$/i.test(filename)
  return `${PHOTOS_BASE_URL}/PROFoto/${filename}${hasExtension ? '' : '.jpg'}`
}

// Deliberately not WEB_URL (which has the "wwww" typo tracked separately above) — this domain
// must exactly match the associatedDomains (iOS) / intentFilters (Android) entries in app.json
// and the domain hosting apple-app-site-association / assetlinks.json, or the universal link
// silently falls back to a plain browser open instead of launching the app.
const SHARE_BASE_URL = 'https://www.marineria.it'

// Public, unauthenticated page — safe to hand out to anyone the offer is shared with. Opens the
// app directly via Universal Links (iOS) / App Links (Android) when it's installed; otherwise
// this path redirects to the App/Play Store, then resumes on this offer after install.
export const getOfferShareUrl = (idoffer: number) => `${SHARE_BASE_URL}/share/offer/${idoffer}`

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
  AVAILABILITY: `${BASE_URL}/api/RegPro/Availability`,
  GET_AVAILABILITY: `${BASE_URL}/api/RegPro/GetAvailability`,
}
