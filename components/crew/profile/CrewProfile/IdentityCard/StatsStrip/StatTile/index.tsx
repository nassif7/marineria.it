import { FC } from 'react'
import { View, Text } from 'react-native'
import { C } from '@/components/appUI/tokens'
import { styles } from './styles'

const StatTile: FC<{ label: string; value: string | number; suffix?: string; color?: string }> = ({
  label,
  value,
  suffix,
  color = C.ink,
}) => (
  <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {suffix ? <Text style={styles.statSuffix}>{suffix}</Text> : null}
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
)

export default StatTile
