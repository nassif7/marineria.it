import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  fieldValue: { fontSize: 14, fontWeight: '500', color: C.ink, lineHeight: 20, marginBottom: 12 },
  fieldValueStrong: { fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 12 },
})
