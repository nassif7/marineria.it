import { StyleSheet } from 'react-native'
import { C } from '@/components/appUI/tokens'

export const styles = StyleSheet.create({
  notifBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: C.orange,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.1,
  },
})
