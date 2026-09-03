import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  accordionRow: { paddingVertical: 12 },
  accordionHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  accordionBody: { marginTop: 8 },
  refRowBorder: { borderTopWidth: 1, borderTopColor: C.hair2 },
  refRole: { fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2 },
  refMeta: { fontSize: 12, color: C.ink3 },
  refYear: { fontSize: 11, color: C.ink4, marginTop: 2 },
  expDates: { fontSize: 11, fontWeight: '500', color: C.ink4, fontVariant: ['tabular-nums'] },
  refDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  refDetailIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  refDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
  },
  refNotes: {
    fontSize: 13,
    lineHeight: 19,
    color: C.ink2,
    marginTop: 8,
  },
})
