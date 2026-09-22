import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { styles } from './styles'

const CompletionMeter: FC<{ pct: number; missing: number }> = ({ pct, missing }) => {
  const { t } = useTranslation('home-screen')
  return (
    <View style={styles.meterRow}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={styles.meterLabel}>{t('crew-profile.completion', { pct })}</Text>
        {missing > 0 ? (
          <Text style={styles.meterMissing}>{t('crew-profile.missing-fields', { count: missing })}</Text>
        ) : null}
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width: `${pct}%` as any }]} />
      </View>
    </View>
  )
}

export default CompletionMeter
