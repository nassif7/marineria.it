import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { styles } from './styles'

const ContactInfoRow: FC<{ icon: FC<any>; label: string; value: string; onPress: () => void; last?: boolean }> = ({
  icon: Icon,
  label,
  value,
  onPress,
  last,
}) => (
  <Pressable style={[styles.contactRow, last && styles.contactRowLast]} onPress={onPress}>
    <View style={styles.contactIcon}>
      <Icon size={16} color={C.orange} strokeWidth={1.8} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
    <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
  </Pressable>
)

export default ContactInfoRow
