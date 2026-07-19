import { FC } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Linking, GestureResponderEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { X, ChevronRight, Info, Mail, Phone, MessageCircle } from 'lucide-react-native'
import { useCrew } from '@/Providers/CrewProvider'
import { getProOfferByIdPost } from '@/api'
import { TNotification } from '@/api/types'
import { C } from '@/components/pro/tokens'

interface NotificationsModalProps {
  visible: boolean
  onClose: () => void
}

type ParsedContact = { name?: string; email?: string; phone?: string; whatsapp?: string }

// Accepted-application notifications carry the recruiter's contact block as raw text, e.g.
// "Contact\nMichele Costabile\nRoma (RM)\ncostabile.michele@me.com\nTel: 3386337722\nWhatsApp: 3386337722<br/>"
// — pull the useful bits out instead of showing that dump verbatim.
const parseContactMessage = (message?: string): ParsedContact | null => {
  if (!message) return null
  const lines = message
    .split('\n')
    .map((l) => l.replace(/<br\s*\/?>/gi, '').trim())
    .filter(Boolean)
  const emailLine = lines.find((l) => /@/.test(l))
  const telLine = lines.find((l) => /^tel:/i.test(l))
  const waLine = lines.find((l) => /whatsapp/i.test(l))
  if (!emailLine && !telLine && !waLine) return null
  return {
    name: lines[1],
    email: emailLine,
    phone: telLine?.replace(/^tel:\s*/i, '').trim(),
    whatsapp: waLine?.replace(/^whatsapp:\s*/i, '').trim(),
  }
}

const openUrl = (url: string) => Linking.openURL(url).catch(() => {})

const ContactAction: FC<{ icon: FC<any>; onPress: () => void }> = ({ icon: Icon, onPress }) => (
  <Pressable
    style={nm.contactBtn}
    hitSlop={6}
    onPress={(e: GestureResponderEvent) => {
      e.stopPropagation()
      onPress()
    }}
  >
    <Icon size={15} color={C.orange} strokeWidth={1.8} />
  </Pressable>
)

const NotificationRow: FC<{ notification: TNotification; onNavigate: () => void }> = ({ notification, onNavigate }) => {
  const {
    i18n: { language },
  } = useTranslation()
  const { token } = useCrew()
  const isNavigable = !!notification.idoffer
  const Row = isNavigable ? Pressable : View
  const contact = parseContactMessage(notification.message)

  const { data: offer } = useQuery({
    queryKey: ['offer', String(notification.idoffer), language],
    queryFn: () => getProOfferByIdPost(String(notification.idoffer), token, language),
    enabled: !!notification.idoffer && !!token,
    select: (data) => data?.[0],
  })
  const offerTitle = offer?.offer?.trim() || offer?.title
  const reference = offer?.reference?.split('_')[1] || offer?.reference

  return (
    <Row style={nm.row} onPress={isNavigable ? onNavigate : undefined}>
      <View style={{ flex: 1, minWidth: 0 }}>
        {notification.title ? <Text style={nm.rowLabel}>{notification.title}</Text> : null}
        {offerTitle ? <Text style={nm.rowTitle}>{offerTitle}</Text> : null}
        {reference ? <Text style={nm.rowRef}>Ref · {reference}</Text> : null}
        {contact ? (
          <>
            {contact.name ? <Text style={nm.rowMessage}>{contact.name}</Text> : null}
            <View style={nm.contactRow}>
              {contact.email ? <ContactAction icon={Mail} onPress={() => openUrl(`mailto:${contact.email}`)} /> : null}
              {contact.phone ? (
                <ContactAction icon={Phone} onPress={() => openUrl(`tel:${contact.phone!.replace(/\s/g, '')}`)} />
              ) : null}
              {contact.whatsapp ? (
                <ContactAction
                  icon={MessageCircle}
                  onPress={() => openUrl(`https://wa.me/${contact.whatsapp!.replace(/\D/g, '')}`)}
                />
              ) : null}
            </View>
          </>
        ) : !offerTitle && notification.message ? (
          <Text style={nm.rowMessage}>{notification.message}</Text>
        ) : null}
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
    // Deep-linking straight into /pro/offers/[id] from outside the "pro" tab skips the list
    // screen in that tab's history, leaving back()/the tab icon with nothing sane to return to —
    // seed the list first so the tab's stack is properly [list, detail].
    router.push('/pro/offers')
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
  rowRef: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    marginTop: 2,
  },
  rowMessage: {
    fontSize: 13,
    color: C.ink3,
    marginTop: 4,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  contactBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
