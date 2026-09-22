import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  identityRow: {
    padding: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  avatar: { width: 72, height: 72, borderRadius: 18 },
  name: { fontSize: 18, fontWeight: '800', color: C.ink, letterSpacing: -0.3, flex: 1, marginRight: 8 },
  role: { fontSize: 14, fontWeight: '700', color: C.orangeText, marginTop: 3, letterSpacing: -0.1 },
  meta: { fontSize: 12, color: C.ink3, marginTop: 6, lineHeight: 16 },
  availInline: {
    fontSize: 12,
    fontWeight: '500',
    color: C.ink3,
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  availDot: { width: 6, height: 6, borderRadius: 99 },
  availText: { fontSize: 11, fontWeight: '600' },
})
