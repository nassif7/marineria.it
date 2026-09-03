import { StyleSheet } from 'react-native'
import { C } from '@/components/pro/tokens'

export const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  contactRowLast: { borderBottomWidth: 0 },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  contactValue: { fontSize: 14, fontWeight: '600', color: C.ink },
})
