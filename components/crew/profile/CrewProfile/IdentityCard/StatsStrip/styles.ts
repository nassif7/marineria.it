import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    backgroundColor: '#FAF9F6',
  },
  statDivider: { width: 1, backgroundColor: C.hair2, marginVertical: 4, marginHorizontal: 16 },
})
