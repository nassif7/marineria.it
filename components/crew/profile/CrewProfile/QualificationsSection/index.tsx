import { FC } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Check, AlertTriangle } from 'lucide-react-native'
import Card from '../shared/Card'
import SectionEyebrow from '../shared/SectionEyebrow'
import Chip from './Chip'
import { styles } from './styles'

const QualificationsSection: FC<{
  hasSeamansBook: boolean
  hasCertificateOfCompetence: boolean
  coursesCount: number
  languagesCount: number
}> = ({ hasSeamansBook, hasCertificateOfCompetence, coursesCount, languagesCount }) => {
  const { t } = useTranslation('home-screen')

  return (
    <>
      <SectionEyebrow label={t('crew-profile.section-qualifications')} />
      <Card>
        <View style={styles.chipsRow}>
          {hasSeamansBook ? (
            <Chip tone="green" icon={Check} label={t('crew-profile.seaman-book')} />
          ) : (
            <Chip tone="warn" icon={AlertTriangle} label={t('crew-profile.no-seaman-book')} />
          )}
          {hasCertificateOfCompetence ? (
            <Chip tone="green" icon={Check} label={t('crew-profile.coc-valid')} />
          ) : (
            <Chip tone="warn" icon={AlertTriangle} label={t('crew-profile.no-coc')} />
          )}
          {coursesCount > 0 && <Chip tone="orange" label={t('crew-profile.courses', { count: coursesCount })} />}
          {languagesCount > 0 && <Chip tone="neutral" label={t('crew-profile.languages', { count: languagesCount })} />}
        </View>
      </Card>
    </>
  )
}

export default QualificationsSection
