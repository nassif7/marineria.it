import { FC } from 'react'
import { View, Text } from 'react-native'
import { C } from '@/components/appUI/tokens'
import { GREEN_SOFT, GREEN_TEXT, WARN_BG, WARN_TEXT, WARN_BORDER } from '../../shared/colors'
import { styles } from './styles'

const Chip: FC<{ tone: 'green' | 'warn' | 'orange' | 'neutral'; icon?: FC<any>; label: string }> = ({
  tone,
  icon: Icon,
  label,
}) => {
  const toneStyles = {
    green: { bg: GREEN_SOFT, border: 'transparent', text: GREEN_TEXT },
    warn: { bg: WARN_BG, border: WARN_BORDER, text: WARN_TEXT },
    orange: { bg: C.orangeSoft, border: 'transparent', text: C.orangeText },
    neutral: { bg: C.field, border: C.hair, text: C.ink2 },
  }[tone]
  return (
    <View style={[styles.chip, { backgroundColor: toneStyles.bg, borderColor: toneStyles.border }]}>
      {Icon ? <Icon size={11} color={toneStyles.text} strokeWidth={2.4} /> : null}
      <Text style={[styles.chipText, { color: toneStyles.text }]}>{label}</Text>
    </View>
  )
}

export default Chip
