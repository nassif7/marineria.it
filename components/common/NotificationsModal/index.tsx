import { FC, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Linking, GestureResponderEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { X, ChevronRight, Info, Mail, Phone, MessageCircle } from 'lucide-react-native'
import { useSession } from '@/Providers/SessionProvider'
import { useCrew } from '@/Providers/CrewProvider'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { getProOfferByIdPost, getRecruiterSearchByIdPost } from '@/api'
import { TNotification, TUserRole } from '@/api/types'
import { navigateToOfferFromNotification, navigateToCrewFromNotification } from '@/hooks/useNotifications'
import { C } from '@/components/pro/tokens'
import OfferOfflineModal from '@/components/common/OfferOfflineModal'
import { getLocalizedOfferTitle } from '@/utils/offerUtils'

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

// Recruiter titles arrive like "Position  Master (CoC) for private M/Y 27M italian Flag [70000_10718]" —
// strip the leading "Position" and surface the reference (the part after the underscore) separately.
const parseNotificationTitle = (notification: TNotification) => {
  const refMatch = notification.title?.match(/\[(\d+)_(\d+)\]/)
  const reference = refMatch ? refMatch[2] : null
  const cleanTitle = (notification.title ?? '')
    .replace(/\[\d+_\d+\]/, '')
    .replace(/^position\s+/i, '')
    .trim()
  const name = notification.message
    ?.split('\n')[1]
    ?.trim()
    .replace(/^for\s+/i, '')
  return { cleanTitle, reference, name }
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

// Crew side: notification is a recruiter reaching out — show their contact info.
const CrewNotificationRow: FC<{ notification: TNotification; onOfferGone: () => void }> = ({
  notification,
  onOfferGone,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { token, markNotificationAsRead } = useCrew()
  const hasOffer = !!notification.idoffer
  const contact = parseContactMessage(notification.message)

  const { data: offer } = useQuery({
    queryKey: ['offer', String(notification.idoffer), language],
    queryFn: () => getProOfferByIdPost(String(notification.idoffer), token, language),
    enabled: hasOffer && !!token,
    select: (data) => data?.[0],
  })
  const offerTitle = offer ? getLocalizedOfferTitle(offer, language) : undefined
  const reference = offer?.reference?.split('_')[1] || offer?.reference
  const title = contact?.name ? t('crew-profile.job-offer-from', { name: contact.name }) : offerTitle

  const handlePress = () => {
    markNotificationAsRead(notification)
    return hasOffer ? navigateToOfferFromNotification(notification, contact) : onOfferGone()
  }

  return (
    <Pressable style={nm.row} onPress={handlePress}>
      {!notification.isread && <View style={nm.unreadDot} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={nm.rowLabel}>{t('crew-profile.notification-activity')}</Text>
        {title ? <Text style={nm.rowTitle}>{title}</Text> : null}
        {offerTitle && contact?.name ? <Text style={nm.rowMessage}>{offerTitle}</Text> : null}
        {reference ? <Text style={nm.rowRef}>Ref · {reference}</Text> : null}
        {contact ? (
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
        ) : !offerTitle && notification.message ? (
          <Text style={nm.rowMessage}>{notification.message}</Text>
        ) : null}
      </View>
      <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
    </Pressable>
  )
}

// Recruiter side: notification is a crew member applying — show who/what, route to their CV.
const RecruiterNotificationRow: FC<{ notification: TNotification; onOfferGone: () => void }> = ({
  notification,
  onOfferGone,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation('home-screen')
  const { token, markNotificationAsRead } = useRecruiter()
  const hasOffer = !!notification.idoffer
  const canNavigate = hasOffer && !!notification.iduser
  const isActionable = !hasOffer || canNavigate
  const Row = isActionable ? Pressable : View
  const { reference: parsedReference, name } = parseNotificationTitle(notification)

  // The raw notification title/message is frozen in whichever language it was created
  // in — re-fetch the search itself so the title reflects the app's current language.
  const { data: search } = useQuery({
    queryKey: ['search', String(notification.idoffer), language],
    queryFn: () => getRecruiterSearchByIdPost(String(notification.idoffer), token, language),
    enabled: hasOffer && !!token,
    select: (data) => data?.[0],
  })
  const title = search?.title?.trim()
  const reference = search?.reference?.split('_')[1] || search?.reference || parsedReference
  const subtitle = [name].filter(Boolean).join(' · ')

  const handlePress = () => {
    markNotificationAsRead(notification)
    return !hasOffer ? onOfferGone() : canNavigate ? navigateToCrewFromNotification(notification) : undefined
  }

  return (
    <Row style={nm.row} onPress={isActionable ? handlePress : undefined}>
      {!notification.isread && <View style={nm.unreadDot} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={nm.rowLabel}>{t('recruiter-profile.notification-new-application')}</Text>
        {/* {subtitle ? <Text style={nm.rowTitle}>{subtitle}</Text> : null} */}
        {subtitle ? <Text style={nm.rowMessage}>{subtitle}</Text> : null}
      </View>
      {isActionable && <ChevronRight size={16} color={C.ink4} strokeWidth={2} />}
    </Row>
  )
}

const NotificationsModal: FC = () => {
  const { t } = useTranslation('home-screen')
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()
  const [offerGoneVisible, setOfferGoneVisible] = useState(false)

  const {
    auth: { role },
  } = useSession()
  const isRecruiter = role === TUserRole.RECRUITER

  const { notifications: crewNotifications } = useCrew()
  const { notifications: recruiterNotifications } = useRecruiter()
  const notifications = isRecruiter ? recruiterNotifications : crewNotifications

  const real = notifications.filter((n) => n.title || n.message)

  return (
    <View style={[nm.container, { paddingTop: top }]}>
      <View style={nm.header}>
        <Text style={nm.headerTitle}>
          {isRecruiter ? t('recruiter-profile.notifications-title') : t('crew-profile.notifications-title')}
        </Text>
        <Pressable style={nm.closeBtn} onPress={() => router.back()}>
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
            <Text style={nm.emptyStateText}>
              {isRecruiter ? t('recruiter-profile.no-notifications') : t('crew-profile.no-notifications')}
            </Text>
          </View>
        ) : (
          <View style={nm.card}>
            {real.map((n, i) => (
              <View key={`${n.idoffer}-${i}`} style={i > 0 && nm.rowBorder}>
                {isRecruiter ? (
                  <RecruiterNotificationRow notification={n} onOfferGone={() => setOfferGoneVisible(true)} />
                ) : (
                  <CrewNotificationRow notification={n} onOfferGone={() => setOfferGoneVisible(true)} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <OfferOfflineModal
        visible={offerGoneVisible}
        onClose={() => setOfferGoneVisible(false)}
        showContactSupport={isRecruiter}
      />
    </View>
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
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.orange,
    marginTop: 5,
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
  rowTitleOrange: {
    color: C.orangeText,
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
