import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Send, Check, AlertTriangle } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { GREEN_TEXT, WARN_TEXT, ORANGE_TEXT } from '../../shared/colors'
import { pillStyles } from '../../shared/pillStyles'
import { styles } from './styles'

const StatusPills: FC<{
  isContacted: boolean
  hasSeamansBook: boolean
  hasCertificateOfCompetence: boolean
  hasCourses: boolean
  coursesCount: number
}> = ({ isContacted, hasSeamansBook, hasCertificateOfCompetence, hasCourses, coursesCount }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  return (
    <View style={styles.pillsRow}>
      {isContacted && (
        <View style={pillStyles.pillOrange}>
          <Send size={10} color={ORANGE_TEXT} strokeWidth={2.4} />
          <Text style={[pillStyles.pillText, { color: ORANGE_TEXT }]}>
            {t('already-contacted', { ns: 'crew-screen' })}
          </Text>
        </View>
      )}
      {hasSeamansBook && (
        <View style={[pillStyles.pill, pillStyles.pillGreen]}>
          <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
          <Text style={[pillStyles.pillText, { color: GREEN_TEXT }]}>{t('seaman-book')}</Text>
        </View>
      )}
      {hasCertificateOfCompetence ? (
        <View style={[pillStyles.pill, pillStyles.pillGreen]}>
          <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
          <Text style={[pillStyles.pillText, { color: GREEN_TEXT }]}>{t('coc-valid')}</Text>
        </View>
      ) : (
        <View style={[pillStyles.pill, pillStyles.pillWarn]}>
          <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
          <Text style={[pillStyles.pillText, { color: WARN_TEXT }]}>{t('no-coc')}</Text>
        </View>
      )}
      {hasCourses ? (
        <View style={[pillStyles.pill, pillStyles.pillNeutral]}>
          <Text style={[pillStyles.pillText, { color: C.ink2 }]}>{t('courses-count', { count: coursesCount })}</Text>
        </View>
      ) : (
        <View style={[pillStyles.pill, pillStyles.pillWarn]}>
          <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
          <Text style={[pillStyles.pillText, { color: WARN_TEXT }]}>{t('no-courses-short')}</Text>
        </View>
      )}
    </View>
  )
}

export default StatusPills
