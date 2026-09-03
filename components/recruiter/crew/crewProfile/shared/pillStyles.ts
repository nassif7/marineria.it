import { StyleSheet } from 'react-native'
import { C } from '@/components/pro/tokens'
import { GREEN_SOFT, WARN_BG, WARN_BORDER, ORANGE_BG } from './colors'

export const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillGreen: { backgroundColor: GREEN_SOFT, borderColor: 'transparent' },
  pillWarn: { backgroundColor: WARN_BG, borderColor: WARN_BORDER },
  pillNeutral: { backgroundColor: C.field, borderColor: C.hair },
  pillOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: ORANGE_BG,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillText: { fontSize: 12, fontWeight: '600' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
})
