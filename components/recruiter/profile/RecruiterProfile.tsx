import { FC, useCallback, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { setFromHome } from '@/utils/fromHomeNav'
import { Bell, Headphones, ChevronRight, Briefcase, Users, Globe, Mail, Phone } from 'lucide-react-native'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { TNotification } from '@/api/types'
import { supportTeam } from '@/api'
import { C } from '@/components/pro/tokens'
import { Loading, RefreshControl } from '@/components/ui'
import { useManualRefresh } from '@/hooks'
import ContactSupport from '@/components/common/ContactSupport'
import RecruiterNotificationsModal from './RecruiterNotificationsModal'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const formatDate = (raw: string): string => {
  if (!raw) return '—'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

// ── Sub-components ──────────────────────────────────────────

const ActionRow: FC<{
  icon: 'briefcase' | 'users' | 'globe'
  title: string
  sub?: string
  accent?: boolean
  last?: boolean
  onPress?: () => void
}> = ({ icon, title, sub, accent, last, onPress }) => {
  const IconComp = icon === 'briefcase' ? Briefcase : icon === 'users' ? Users : Globe
  return (
    <Pressable style={[s.actionRow, last && s.actionRowLast]} onPress={onPress}>
      <View style={[s.actionIcon, accent && s.actionIconAccent]}>
        <IconComp size={18} color={accent ? C.orange : C.ink2} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.actionTitle}>{title}</Text>
        {sub && <Text style={s.actionSub}>{sub}</Text>}
      </View>
      <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
    </Pressable>
  )
}

const ContactRow: FC<{
  icon: 'mail' | 'phone' | 'globe'
  label: string
  value: string
  tag?: string
  onPress?: () => void
  last?: boolean
}> = ({ icon, label, value, tag, onPress, last }) => {
  const IconComp = icon === 'mail' ? Mail : icon === 'phone' ? Phone : Globe
  return (
    <Pressable style={[s.contactRow, last && s.contactRowLast]} onPress={onPress} disabled={!onPress}>
      <IconComp size={18} color={C.ink3} strokeWidth={1.8} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.contactLabel}>{label}</Text>
        <Text style={s.contactValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {tag && (
        <View style={s.whatsappPill}>
          <Text style={s.whatsappPillText}>{tag}</Text>
        </View>
      )}
    </Pressable>
  )
}

// ── Main screen ─────────────────────────────────────────────

const RecruiterProfile: FC = () => {
  const { t } = useTranslation('home-screen')
  const router = useRouter()
  const { recruiter: user, searches, notifications, isLoading, refetch } = useRecruiter()
  const { refreshing, onRefresh } = useManualRefresh(refetch)
  const [notificationsVisible, setNotificationsVisible] = useState(false)

  const goToRecruiter = useCallback(
    (searchId: number, target: 'detail' | 'crew-list') => {
      setFromHome()
      if (target === 'crew-list') {
        router.push(`/(tabs)/recruiter/search/${searchId}/crew/list` as any)
      } else {
        router.push(`/(tabs)/recruiter/search/${searchId}` as any)
      }
    },
    [router]
  )

  const realNotifications = notifications.filter((n) => n.title || n.message)
  const hasNotifications = realNotifications.length > 0

  const handleSelectNotification = (notification: TNotification) => {
    setNotificationsVisible(false)
    if (notification.idoffer) goToRecruiter(notification.idoffer, 'crew-list')
  }

  const waNumber = user?.whatsapp?.replace(/^https?:\/\/wa\.me\//, '') ?? ''
  const isSameAsWa = !!user?.cellular && !!waNumber && user.cellular === waNumber

  const initials = user ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase() : '?'

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Loading />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Top bar */}
      <View style={s.topBar}>
        <Pressable style={s.iconBtn} onPress={() => setNotificationsVisible(true)}>
          <Bell size={18} color={C.ink2} strokeWidth={1.8} />
          {hasNotifications && <View style={s.notifDot} />}
        </Pressable>
        <ContactSupport
          title={t('contact-support', { ns: 'settings-screen' })}
          supportTeam={supportTeam}
          renderTrigger={({ onPress }) => (
            <Pressable style={s.iconBtn} onPress={onPress}>
              <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
            </Pressable>
          )}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Identity card */}
        <View style={s.rowCard}>
          <View style={s.identityRow}>
            <View style={s.avatar}>
              <Text style={s.avatarInitials}>{initials}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.name}>
                {user?.name} {user?.surname}
              </Text>
              {user?.company ? (
                <Text style={s.company} numberOfLines={1}>
                  {user.company}
                </Text>
              ) : null}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <View style={s.recruiterPill}>
                  <Users size={10} color={C.orange} strokeWidth={2.4} />
                  <Text style={s.recruiterPillText}>Recruiter</Text>
                </View>
                {user?.city || user?.province ? (
                  <Text style={s.cityMeta}>· {[user?.city, user?.province].filter(Boolean).join(', ')}</Text>
                ) : null}
              </View>
              {user?.address ? (
                <Text style={s.addressMeta} numberOfLines={1}>
                  {user.address}
                </Text>
              ) : null}
              {user?.iduser ? <Text style={s.idMeta}>ID · {user.iduser}</Text> : null}
            </View>
          </View>
        </View>

        {/* Notifications banner */}
        {hasNotifications && (
          <Pressable style={s.banner} onPress={() => setNotificationsVisible(true)}>
            <View style={s.bannerIcon}>
              <Bell size={20} color="#fff" strokeWidth={2} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.bannerTitle}>
                {t('recruiter-profile.notifications-count', { count: realNotifications.length })}
              </Text>
              {realNotifications[0].title ? <Text style={s.bannerSub}>{realNotifications[0].title}</Text> : null}
            </View>
            <ChevronRight size={18} color="#fff" strokeWidth={2.4} />
          </Pressable>
        )}

        {/* Searches list */}
        <Text style={s.sectionEyebrow}>{t('recruiter-profile.section-activity')}</Text>
        <View style={s.rowCard}>
          {searches.map((search, i) => (
            <ActionRow
              key={search.idoffer}
              icon="briefcase"
              title={search.mainPosition || search.title || `Ref · ${search.reference}`}
              sub={`${search.countCandidates} crew · ${search.countContacted} contattati`}
              accent
              last={i === searches.length - 1}
              onPress={() => goToRecruiter(search.idoffer, 'detail')}
            />
          ))}
        </View>

        {/* Contacts */}
        <Text style={s.sectionEyebrow}>{t('recruiter-profile.section-contacts')}</Text>
        <View style={s.rowCard}>
          <ContactRow icon="mail" label={t('recruiter-profile.label-email')} value={user?.email || '—'} />
          <ContactRow
            icon="phone"
            label={t('recruiter-profile.label-mobile')}
            value={user?.cellular || '—'}
            tag={isSameAsWa ? 'WhatsApp' : undefined}
          />
          <ContactRow icon="globe" label={t('recruiter-profile.label-website')} value={user?.url || '—'} last />
        </View>

        {/* Footer meta */}
        {user?.registrationDate || user?.lastAccessDate ? (
          <Text style={s.footerMeta}>
            {[
              user.registrationDate &&
                t('recruiter-profile.registered-on', { date: formatDate(user.registrationDate) }),
              user.lastAccessDate && t('recruiter-profile.last-access', { date: formatDate(user.lastAccessDate) }),
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        ) : null}
      </ScrollView>

      <RecruiterNotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        notifications={notifications}
        onSelect={handleSelectNotification}
      />
    </View>
  )
}

const s = StyleSheet.create({
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.orange,
    borderWidth: 1.5,
    borderColor: C.field,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  rowCard: {
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  identityRow: {
    padding: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: C.orange,
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
  },
  company: {
    fontSize: 13,
    color: C.ink2,
    marginTop: 2,
  },
  recruiterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: C.orangeSoft,
  },
  recruiterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.orange,
  },
  cityMeta: {
    fontSize: 11,
    color: C.ink4,
  },
  addressMeta: {
    fontSize: 12,
    color: C.ink3,
    marginTop: 4,
  },
  idMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    backgroundColor: '#FAF9F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.hair2,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  banner: {
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
  bannerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.1,
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 1,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.ink3,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  actionRowLast: {
    borderBottomWidth: 0,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionIconAccent: {
    backgroundColor: C.orangeSoft,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.ink,
    letterSpacing: -0.1,
  },
  actionSub: {
    fontSize: 12,
    color: C.ink3,
    marginTop: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
  whatsappPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: '#E6F5EA',
  },
  whatsappPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F7A28',
  },
  footerMeta: {
    textAlign: 'center',
    fontSize: 11,
    color: C.ink4,
    letterSpacing: 0.2,
    marginTop: 16,
    marginHorizontal: 22,
  },
})

export default RecruiterProfile
