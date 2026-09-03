import { StyleSheet } from 'react-native'
import { C } from '@/components/pro/tokens'

export const styles = StyleSheet.create({
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: C.field,
    borderRadius: 10,
    marginBottom: 8,
  },
  emptyStateText: { fontSize: 13, fontWeight: '500', color: C.ink3 },
})
