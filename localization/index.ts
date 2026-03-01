import * as SecureStore from 'expo-secure-store'
import { getLocales } from 'expo-localization'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import translationEn from './resources/en.json'
import translationIt from './resources/it.json'

const resources = {
  en: translationEn,
  it: translationIt,
}

export enum TLocales {
  EN = 'en',
  IT = 'it',
}

const initI18n = async () => {
  let savedLanguage = await SecureStore.getItemAsync('language')

  if (!savedLanguage) {
    savedLanguage = getLocales()[0].languageCode == 'it' ? 'it' : 'en'
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    ns: [
      'screens-labels',
      'login-screen',
      'home-screen',
      'offers-screen',
      'search-screen',
      'crew-screen',
      'recruiter-screen',
      'settings-screen',
      'offer',
      'crew',
      'common',

      'login-screen',
    ],
    defaultNS: 'home-screen',
    fallbackNS: ['common', 'offer'],
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

export default i18n
