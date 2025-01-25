import i18n from 'i18next'
import * as SecureStore from 'expo-secure-store'
import { getLocales } from 'expo-localization'
import { initReactI18next } from 'react-i18next'
import translationEn from './resources/en.json'
import translationIt from './resources/it.json'

const resources = {
  en: { translation: translationEn },
  it: { translation: translationIt },
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
    interpolation: {
      escapeValue: false,
    },
  })
}

initI18n()

export default i18n
