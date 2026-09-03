import { StyleSheet } from 'react-native'
import { C } from '@/components/pro/tokens'

export const styles = StyleSheet.create({
  accordionRow: { paddingVertical: 12 },
  expRowBorder: { borderTopWidth: 1, borderTopColor: C.hair2 },
  accordionHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  accordionBody: { marginTop: 8 },
  accordionBodyText: { fontSize: 13, lineHeight: 20, color: C.ink2 },
  expRole: { fontSize: 14, fontWeight: '700', color: C.ink },
  expMeta: { fontSize: 12, color: C.ink3, marginTop: 2 },
  expDates: { fontSize: 11, fontWeight: '500', color: C.ink4, fontVariant: ['tabular-nums'] },
})
