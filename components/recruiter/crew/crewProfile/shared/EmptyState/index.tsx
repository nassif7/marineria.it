import { FC } from 'react'
import { View, Text } from 'react-native'
import { Info } from 'lucide-react-native'
import { C } from '@/components/pro/tokens'
import { styles } from './styles'

const EmptyState: FC<{ text: string }> = ({ text }) => (
  <View style={styles.emptyState}>
    <Info size={14} color={C.ink3} strokeWidth={1.8} />
    <Text style={styles.emptyStateText}>{text}</Text>
  </View>
)

export default EmptyState
