import { FC } from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TLocales } from '@/localization'
import { C } from '@/components/pro/tokens'

interface ISwitchLanguageProps {
  language: TLocales
  onLanguageChange: (value: string) => void
  languageOptions: { label: string; value: TLocales }[]
}

const SwitchLanguage: FC<ISwitchLanguageProps> = ({ language, onLanguageChange, languageOptions }) => {
  const { t } = useTranslation('settings-screen')
  const target = languageOptions.find((o) => o.value !== language) ?? languageOptions[0]

  return (
    <Pressable style={sl.button} onPress={() => onLanguageChange(target.value)}>
      {/* Label is shown in the target language itself (not the current one) so it reads clearly either way */}
      <Text style={sl.buttonText}>{t('switch-language-to', { language: target.label, lng: target.value })}</Text>
    </Pressable>
  )
}

const sl = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.field,
    borderWidth: 1,
    borderColor: C.hair,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink2,
  },
})

export default SwitchLanguage
