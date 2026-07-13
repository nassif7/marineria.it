import { FC } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { X, Bell, ChevronRight, Info } from 'lucide-react-native'
import { useCrew } from '@/Providers/CrewProvider'
import { TNotification } from '@/api/types'
import { C } from '@/components/pro/tokens'

interface NotificationsModalProps {
  visible: boolean
  onClose: () => void
}

const NotificationRow: FC<{ notification: TNotification; onNavigate: () => void }> = ({ notification, onNavigate }) => {
  const isNavigable = !!notification.idoffer
  const Row = isNavigable ? Pressable : View
  return (
    <Row style={nm.row} onPress={isNavigable ? onNavigate : undefined}>
      <View style={nm.rowIcon}>
        <Bell size={16} color={C.orange} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {notification.category ? <Text style={nm.rowCategory}>{notification.category}</Text> : null}
        {notification.title ? <Text style={nm.rowTitle}>{notification.title}</Text> : null}
        {notification.message ? <Text style={nm.rowMessage}>{notification.message}</Text> : null}
      </View>
      {isNavigable && <ChevronRight size={16} color={C.ink4} strokeWidth={2} />}
    </Row>
  )
}

const NotificationsModal: FC<NotificationsModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation('home-screen')
  const { top, bottom } = useSafeAreaInsets()
  const { notifications } = useCrew()
  const router = useRouter()

  const real = notifications.filter((n) => n.title || n.message)

  const handleNavigate = (notification: TNotification) => {
    onClose()
    router.push(`/pro/offers/${notification.idoffer}`)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[nm.container, { paddingTop: top }]}>
        <View style={nm.header}>
          <Text style={nm.headerTitle}>{t('crew-profile.notifications-title')}</Text>
          <Pressable style={nm.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          {real.length === 0 ? (
            <View style={nm.emptyState}>
              <Info size={14} color={C.ink3} strokeWidth={1.8} />
              <Text style={nm.emptyStateText}>{t('crew-profile.no-notifications')}</Text>
            </View>
          ) : (
            <View style={nm.card}>
              {real.map((n, i) => (
                <View key={`${n.idoffer}-${i}`} style={i > 0 && nm.rowBorder}>
                  <NotificationRow notification={n} onNavigate={() => handleNavigate(n)} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}

const nm = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.hair2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  rowCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: C.ink4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
  },
  rowMessage: {
    fontSize: 13,
    color: C.ink3,
    marginTop: 2,
    lineHeight: 18,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    padding: 14,
    backgroundColor: C.field,
    borderRadius: 10,
  },
  emptyStateText: { fontSize: 13, fontWeight: '500', color: C.ink3 },
})

export default NotificationsModal

NotificationsModal.displayName = 'NotificationsModal'
