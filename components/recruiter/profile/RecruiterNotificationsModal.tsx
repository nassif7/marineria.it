import { FC } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { X, ChevronRight, Info } from 'lucide-react-native'
import { TNotification } from '@/api/types'
import { C } from '@/components/pro/tokens'

interface RecruiterNotificationsModalProps {
  visible: boolean
  onClose: () => void
  notifications: TNotification[]
  onSelect: (notification: TNotification) => void
}

// Titles arrive like "Position  Master (CoC) for private M/Y 27M italian Flag [70000_10718]" —
// strip the leading "Position" and surface the reference (the part after the underscore) separately.
const parseNotification = (notification: TNotification) => {
  const refMatch = notification.title?.match(/\[(\d+)_(\d+)\]/)
  const reference = refMatch ? refMatch[2] : null
  const cleanTitle = (notification.title ?? '')
    .replace(/\[\d+_\d+\]/, '')
    .replace(/^position\s+/i, '')
    .trim()
  const name = notification.message?.split('\n')[1]?.trim()
  return { cleanTitle, reference, name }
}

const NotificationRow: FC<{ notification: TNotification; onNavigate: () => void }> = ({ notification, onNavigate }) => {
  const { t } = useTranslation(['search-screen'])
  const isNavigable = !!notification.idoffer && !!notification.iduser
  const Row = isNavigable ? Pressable : View
  const { cleanTitle, reference, name } = parseNotification(notification)
  const subtitle = [reference ? `Ref · ${reference}` : null, name].filter(Boolean).join(' · ')

  return (
    <Row style={nm.row} onPress={isNavigable ? onNavigate : undefined}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={nm.rowLabel}>{t('contacted', { ns: 'search-screen' })}</Text>
        {cleanTitle ? <Text style={nm.rowTitle}>{cleanTitle}</Text> : null}
        {subtitle ? <Text style={nm.rowMessage}>{subtitle}</Text> : null}
      </View>
      {isNavigable && <ChevronRight size={16} color={C.ink4} strokeWidth={2} />}
    </Row>
  )
}

const RecruiterNotificationsModal: FC<RecruiterNotificationsModalProps> = ({
  visible,
  onClose,
  notifications,
  onSelect,
}) => {
  const { t } = useTranslation('home-screen')
  const { top, bottom } = useSafeAreaInsets()

  const real = notifications.filter((n) => n.title || n.message)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[nm.container, { paddingTop: top }]}>
        <View style={nm.header}>
          <Text style={nm.headerTitle}>{t('recruiter-profile.notifications-title')}</Text>
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
              <Text style={nm.emptyStateText}>{t('recruiter-profile.no-notifications')}</Text>
            </View>
          ) : (
            <View style={nm.card}>
              {real.map((n, i) => (
                <View key={`${n.idoffer}-${i}`} style={i > 0 && nm.rowBorder}>
                  <NotificationRow notification={n} onNavigate={() => onSelect(n)} />
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
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.orangeText,
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

export default RecruiterNotificationsModal

RecruiterNotificationsModal.displayName = 'RecruiterNotificationsModal'
