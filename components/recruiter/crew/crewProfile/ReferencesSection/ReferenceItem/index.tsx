import { FC, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react-native'
import { C } from '@/components/pro/tokens'
import HtmlText from '@/components/pro/HtmlText'
import { TCrewReference } from '@/api/types'
import { styles } from './styles'

const ReferenceItem: FC<{ ref: TCrewReference; index: number; isContacted: boolean }> = ({
  ref,
  index,
  isContacted,
}) => {
  const [open, setOpen] = useState(false)
  const hasContactDetail = isContacted && !!(ref.telephone || ref.email)
  const hasDetail = hasContactDetail || !!ref.notes
  return (
    <Pressable
      onPress={() => hasDetail && setOpen((v) => !v)}
      style={[styles.accordionRow, index > 0 && styles.refRowBorder]}
    >
      <View style={styles.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.refRole} numberOfLines={1}>
            {ref.positionreferent}
          </Text>
          {ref.company_name || ref.yacht ? (
            <Text style={styles.refMeta} numberOfLines={1}>
              {[ref.company_name, ref.yacht].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {ref.yearreference ? <Text style={styles.expDates}>{ref.yearreference}</Text> : null}
          {hasDetail ? (
            open ? (
              <ChevronUp size={14} color={C.ink4} strokeWidth={2} />
            ) : (
              <ChevronDown size={14} color={C.ink4} strokeWidth={2} />
            )
          ) : null}
        </View>
      </View>
      {open && (
        <View style={styles.accordionBody}>
          {hasContactDetail && ref.telephone ? (
            <View style={styles.refDetailRow}>
              <View style={styles.refDetailIcon}>
                <Phone size={13} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={styles.refDetailText}>{ref.telephone}</Text>
            </View>
          ) : null}
          {hasContactDetail && ref.email ? (
            <View style={styles.refDetailRow}>
              <View style={styles.refDetailIcon}>
                <Mail size={13} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={styles.refDetailText}>{ref.email}</Text>
            </View>
          ) : null}
          {ref.notes ? <HtmlText style={styles.refNotes}>{ref.notes}</HtmlText> : null}
        </View>
      )}
    </Pressable>
  )
}

export default ReferenceItem
