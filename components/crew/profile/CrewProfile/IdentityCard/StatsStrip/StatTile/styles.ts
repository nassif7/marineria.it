import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  statValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.6, lineHeight: 26 },
  statSuffix: { fontSize: 11, fontWeight: '600', color: C.ink3, marginBottom: 2 },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 6,
  },
})
