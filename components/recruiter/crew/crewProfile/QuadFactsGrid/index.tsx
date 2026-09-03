import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Calendar, Briefcase, Euro, Clock } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { styles } from './styles'

const QuadFactsGrid: FC<{
  dateAvailability: string
  calculatedExperience: string
  salary: string
  lastAccessDate: string
}> = ({ dateAvailability, calculatedExperience, salary, lastAccessDate }) => {
  const { t } = useTranslation(['crew', 'offer'])

  return (
    <View style={styles.quadGrid}>
      {(
        [
          { Icon: Calendar, label: t('available-from', { ns: 'crew' }), value: dateAvailability },
          { Icon: Briefcase, label: t('experience', { ns: 'crew' }), value: calculatedExperience },
          { Icon: Euro, label: t('salary', { ns: 'offer' }), value: salary },
          { Icon: Clock, label: t('last-seen', { ns: 'crew' }), value: lastAccessDate },
        ] as const
      ).map(({ Icon, label, value }, i) => (
        <View
          key={label}
          style={[
            styles.quadCell,
            i % 2 === 0 && { borderRightWidth: 1, borderRightColor: C.hair2 },
            i < 2 && { borderBottomWidth: 1, borderBottomColor: C.hair2 },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Icon size={13} color={C.ink4} strokeWidth={1.8} />
            <Text style={styles.quadLabel}>{label}</Text>
          </View>
          <Text style={styles.quadValue}>{value || '—'}</Text>
        </View>
      ))}
    </View>
  )
}

export default QuadFactsGrid
