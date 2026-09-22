import { FC } from 'react'
import { View, Text } from 'react-native'
import { styles } from './styles'

const FieldRow: FC<{ label: string; value?: string | null; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={bold ? styles.fieldValueStrong : styles.fieldValue}>{value || '—'}</Text>
  </View>
)

export default FieldRow
