import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  meterRow: { paddingHorizontal: 18, paddingBottom: 14 },
  meterLabel: { fontSize: 12, fontWeight: '600', color: C.ink3 },
  meterMissing: { fontSize: 12, fontWeight: '600', color: C.orangeText },
  meterTrack: {
    height: 6,
    borderRadius: 99,
    backgroundColor: C.field,
    overflow: 'hidden',
  },
  meterFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 99,
    backgroundColor: C.orange,
  },
})
