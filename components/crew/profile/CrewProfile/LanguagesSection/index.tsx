import { FC } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Card from '../shared/Card'
import SectionEyebrow from '../shared/SectionEyebrow'
import Chip from '../QualificationsSection/Chip'
import { styles } from '../QualificationsSection/styles'

const LanguagesSection: FC<{ languages: string[] }> = ({ languages }) => {
  const { t } = useTranslation('home-screen')

  if (languages.length === 0) return null

  return (
    <>
      <SectionEyebrow label={t('crew-profile.section-languages')} />
      <Card>
        <View style={styles.chipsRow}>
          {languages.map((lang, i) => (
            <Chip key={i} tone="neutral" label={lang} />
          ))}
        </View>
      </Card>
    </>
  )
}

export default LanguagesSection
