import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 6,
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: C.ink4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
})
