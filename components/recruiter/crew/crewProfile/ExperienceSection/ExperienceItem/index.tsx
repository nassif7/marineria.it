import { FC, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { HtmlText } from '@/components/appUI'
import { TCrewExperience } from '@/api/types'
import { styles } from './styles'

const ExperienceItem: FC<{ exp: TCrewExperience; index: number }> = ({ exp, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <Pressable onPress={() => setOpen((v) => !v)} style={[styles.accordionRow, index > 0 && styles.expRowBorder]}>
      <View style={styles.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.expRole} numberOfLines={open ? undefined : 1}>
            {exp.typeofemployment || '—'}
          </Text>
          {exp.boatcompany || exp.employer ? (
            <Text style={styles.expMeta} numberOfLines={1}>
              {[exp.boatcompany, exp.employer].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={styles.expDates}>{[exp.fromDate, exp.toDate].filter(Boolean).join(' – ')}</Text>
          {open ? (
            <ChevronUp size={14} color={C.ink4} strokeWidth={2} />
          ) : (
            <ChevronDown size={14} color={C.ink4} strokeWidth={2} />
          )}
        </View>
      </View>
      {open && exp.typeofassignment ? (
        <HtmlText style={{ ...styles.accordionBody, ...styles.accordionBodyText }}>{exp.typeofassignment}</HtmlText>
      ) : null}
    </Pressable>
  )
}

export default ExperienceItem
