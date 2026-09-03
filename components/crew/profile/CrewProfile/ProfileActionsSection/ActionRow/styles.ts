import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  actionRowLast: { borderBottomWidth: 0 },
  actionRowDisabled: { opacity: 0.45 },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionIconAccent: { backgroundColor: C.orangeSoft },
  actionTitle: { fontSize: 15, fontWeight: '600', color: C.ink, letterSpacing: -0.1 },
  actionSub: { fontSize: 12, color: C.ink3, marginTop: 1 },
  comingSoonBadge: {
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
  },
  comingSoonText: { fontSize: 10, fontWeight: '700', color: C.orangeText, letterSpacing: 0.2 },
})
