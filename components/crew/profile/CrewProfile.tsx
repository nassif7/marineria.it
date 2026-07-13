import { FC, useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Image, RefreshControl } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  Edit2,
  Headphones,
  ChevronRight,
  Check,
  AlertTriangle,
  Users,
  FileText,
  Calendar,
  Bell,
} from 'lucide-react-native'
import { useCrew } from '@/Providers/CrewProvider'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'
import { C } from '@/components/pro/tokens'
import { Loading } from '@/components/ui'
import PublicPreviewModal from './PublicPreviewModal'

const GREEN_SOFT = '#E8F8EB'
const GREEN_TEXT = '#0F7A28'
const WARN_BG = '#FFF7ED'
const WARN_TEXT = '#C2600A'
const WARN_BORDER = '#FDDCB5'

const MONTHS_EN = [
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
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`
}

// ── Experience parser ──────────────────────────────────────
const parseExperience = (exp: string, t: (k: string, o?: any) => string): { value: string; suffix: string } => {
  if (!exp) return { value: '—', suffix: '' }
  const yearMatch = exp.match(/(\d+)\s*(?:year|ann)/i)
  const monthMatch = exp.match(/(\d+)\s*(?:month|mes)/i)
  const years = yearMatch ? parseInt(yearMatch[1]) : 0
  const months = monthMatch ? parseInt(monthMatch[1]) : 0
  if (years > 0) {
    const y = months >= 6 ? years + 1 : years
    return { value: String(y), suffix: t(`crew-profile.exp-year`, { count: y }) }
  }
  if (months > 0) return { value: String(months), suffix: t(`crew-profile.exp-month`, { count: months }) }
  return { value: exp, suffix: '' }
}

// ── Completion calculation ─────────────────────────────────
const COMPLETION_FIELDS = [
  'userPhoto',
  'mainPosition',
  'nationality',
  'city',
  'dateAvailability',
  'salary',
  'educationalLevel',
  'courses',
  'seamansBook',
  'cellular',
  'calculatedExperience',
  'language1',
  'curriculum',
  'ita_yachts_deck',
]

const calcCompletion = (u: Record<string, any>) => {
  const filled = COMPLETION_FIELDS.filter((k) => !!u[k]).length
  const pct = Math.round((filled / COMPLETION_FIELDS.length) * 100)
  const missing = COMPLETION_FIELDS.length - filled
  return { pct, missing }
}

// ── Sub-components ──────────────────────────────────────────

const AvatarPlaceholder: FC<{ size: number; radius: number }> = ({ size, radius }) => (
  <View style={[s.avatarPlaceholder, { width: size, height: size, borderRadius: radius }]}>
    <Users size={size * 0.42} color={C.orange} strokeWidth={1.6} />
  </View>
)

const StatTile: FC<{ label: string; value: string | number; suffix?: string; color?: string }> = ({
  label,
  value,
  suffix,
  color = C.ink,
}) => (
  <View style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
      <Text style={[s.statValue, { color }]}>{value}</Text>
      {suffix ? <Text style={s.statSuffix}>{suffix}</Text> : null}
    </View>
    <Text style={s.statLabel}>{label}</Text>
  </View>
)

const Chip: FC<{ tone: 'green' | 'warn' | 'orange' | 'neutral'; icon?: FC<any>; label: string }> = ({
  tone,
  icon: Icon,
  label,
}) => {
  const styles = {
    green: { bg: GREEN_SOFT, border: 'transparent', text: GREEN_TEXT },
    warn: { bg: WARN_BG, border: WARN_BORDER, text: WARN_TEXT },
    orange: { bg: C.orangeSoft, border: 'transparent', text: C.orangeText },
    neutral: { bg: C.field, border: C.hair, text: C.ink2 },
  }[tone]
  return (
    <View style={[s.chip, { backgroundColor: styles.bg, borderColor: styles.border }]}>
      {Icon ? <Icon size={11} color={styles.text} strokeWidth={2.4} /> : null}
      <Text style={[s.chipText, { color: styles.text }]}>{label}</Text>
    </View>
  )
}

const ActionRow: FC<{
  icon: FC<any>
  title: string
  sub?: string
  accent?: boolean
  last?: boolean
  disabled?: boolean
  onPress?: () => void
}> = ({ icon: Icon, title, sub, accent, last, disabled, onPress }) => {
  const { t } = useTranslation('home-screen')
  return (
    <Pressable
      style={[s.actionRow, last && s.actionRowLast, disabled && s.actionRowDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[s.actionIcon, accent && !disabled && s.actionIconAccent]}>
        <Icon size={18} color={disabled ? C.ink4 : accent ? C.orange : C.ink2} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.actionTitle}>{title}</Text>
        {sub ? <Text style={s.actionSub}>{sub}</Text> : null}
      </View>
      {disabled ? (
        <View style={s.comingSoonBadge}>
          <Text style={s.comingSoonText}>{t('crew-profile.coming-soon')}</Text>
        </View>
      ) : (
        <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
      )}
    </Pressable>
  )
}

// ── Main screen ─────────────────────────────────────────────

const CrewProfile: FC = () => {
  const { t } = useTranslation('home-screen')
  const { crew, notifications, isLoading, isRefetching, refetch } = useCrew()
  const [previewVisible, setPreviewVisible] = useState(false)

  const age = crew?.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const photoUrl = crew?.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const { hasCertificateOfCompetence } = useMemo(
    () => (crew ? getCertificateOfCompetence(crew as any) : { hasCertificateOfCompetence: false }),
    [crew]
  )
  const hasSeamansBook = crew ? getSeamansBook(crew as any) : false
  const coursesList = useMemo(
    () =>
      crew?.courses
        ?.split(',')
        .map((c) => c.trim())
        .filter(Boolean) ?? [],
    [crew?.courses]
  )
  const languages = useMemo(
    () => [crew?.language1, crew?.language2, crew?.language3, crew?.language4].filter(Boolean),
    [crew]
  )
  const { pct, missing } = useMemo(() => (crew ? calcCompletion(crew as any) : { pct: 0, missing: 0 }), [crew])

  const isAvailable = !!(
    crew?.availability &&
    (crew.availability.toLowerCase().includes('disponibil') || crew.availability.toLowerCase().includes('available'))
  )
  const availabilityLabel = isAvailable ? t('crew-profile.available') : t('crew-profile.not-available')

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
        <Pressable style={s.iconBtn}>
          <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Identity hero card */}
        <View style={s.rowCard}>
          <View style={s.identityRow}>
            {/* Avatar */}
            <View style={{ flexShrink: 0 }}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={s.avatar} />
              ) : (
                <AvatarPlaceholder size={72} radius={18} />
              )}
            </View>

            {/* Identity */}
            <View style={{ flex: 1, minWidth: 0 }}>
              {/* Name + availability badge in the same row — exactly like the design */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <Text style={[s.name, { flex: 1 }]}>
                  {crew?.name || 'John'} {crew?.surname || 'Doe'}
                </Text>
                <View style={[s.availPill, { backgroundColor: isAvailable ? GREEN_SOFT : C.field, flexShrink: 0 }]}>
                  {isAvailable && <View style={[s.availDot, { backgroundColor: GREEN_TEXT }]} />}
                  <Text style={[s.availText, { color: isAvailable ? GREEN_TEXT : C.ink3 }]}>{availabilityLabel}</Text>
                </View>
              </View>

              {/* Role */}
              {crew?.mainPosition ? <Text style={s.role}>{crew.mainPosition}</Text> : null}

              {/* Meta: nationality · age · city */}
              <Text style={s.meta}>
                {[crew?.nationality, age ? t('crew-profile.age', { count: age }) : null, crew?.city]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
          </View>

          {/* Completion meter */}
          <View style={s.meterRow}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={s.meterLabel}>{t('crew-profile.completion', { pct })}</Text>
              <Pressable>
                <Text style={s.meterMissing}>{t('crew-profile.missing-fields', { count: missing })}</Text>
              </Pressable>
            </View>
            <View style={s.meterTrack}>
              <View style={[s.meterFill, { width: `${pct}%` as any }]} />
            </View>
          </View>

          {/* Stats strip */}
          <View style={s.statsStrip}>
            <StatTile label={t('crew-profile.stat-views')} value={crew?.numberClick ?? 0} color={C.ink} />
            <View style={s.statDivider} />
            <StatTile
              label={t('crew-profile.stat-experience')}
              value={parseExperience(crew?.calculatedExperience ?? '', t).value}
              suffix={parseExperience(crew?.calculatedExperience ?? '', t).suffix}
              color={C.ink}
            />
            <View style={s.statDivider} />
            <StatTile
              label={t('crew-profile.stat-references')}
              value={crew?.referencesNumber ?? 0}
              color={GREEN_TEXT}
            />
          </View>
        </View>

        {/* Notifications */}
        {(() => {
          const real = notifications.filter((n) => n.title || n.message)
          const hasNotifs = real.length > 0
          return (
            <View style={s.notifBanner}>
              <View style={s.notifIcon}>
                <Bell size={18} color="#fff" strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                {!hasNotifs ? (
                  <Text style={s.notifTitle}>{t('crew-profile.no-notifications')}</Text>
                ) : (
                  <>
                    <Text style={s.notifTitle}>{t('crew-profile.notifications-count', { count: real.length })}</Text>
                    {real[0].title ? <Text style={s.notifMessage}>{real[0].title}</Text> : null}
                  </>
                )}
              </View>
              {hasNotifs && <ChevronRight size={18} color="#fff" strokeWidth={2.4} />}
            </View>
          )
        })()}

        {/* Qualifications */}
        <Text style={s.eyebrow}>{t('crew-profile.section-qualifications')}</Text>
        <View style={s.rowCard}>
          <View style={s.chipsRow}>
            {hasSeamansBook ? (
              <Chip tone="green" icon={Check} label={t('crew-profile.seaman-book')} />
            ) : (
              <Chip tone="warn" icon={AlertTriangle} label={t('crew-profile.no-seaman-book')} />
            )}
            {hasCertificateOfCompetence ? (
              <Chip tone="green" icon={Check} label={t('crew-profile.coc-valid')} />
            ) : (
              <Chip tone="warn" icon={AlertTriangle} label={t('crew-profile.no-coc')} />
            )}
            {coursesList.length > 0 && (
              <Chip tone="orange" label={t('crew-profile.courses', { count: coursesList.length })} />
            )}
            {languages.length > 0 && (
              <Chip tone="neutral" label={t('crew-profile.languages', { count: languages.length })} />
            )}
          </View>
        </View>

        {/* Profile actions */}
        <Text style={s.eyebrow}>{t('crew-profile.section-profile')}</Text>
        <View style={s.rowCard}>
          <ActionRow
            icon={Users}
            title={t('crew-profile.action-preview')}
            sub={t('crew-profile.action-preview-sub')}
            onPress={() => setPreviewVisible(true)}
          />
          <ActionRow
            icon={Edit2}
            title={t('crew-profile.action-edit')}
            sub={t('crew-profile.action-edit-sub', { count: missing })}
            accent
            disabled
          />
          <ActionRow
            icon={FileText}
            title={t('crew-profile.action-docs')}
            sub={t('crew-profile.action-docs-sub', { count: coursesList.length })}
            disabled
          />
          <ActionRow
            icon={Calendar}
            title={t('crew-profile.action-availability')}
            sub={
              crew?.dateAvailability
                ? t('crew-profile.action-availability-sub', { date: crew.dateAvailability })
                : availabilityLabel
            }
            disabled
            last
          />
        </View>

        {/* Footer meta */}
        {crew?.registraton_date || crew?.lastAccessDate ? (
          <Text style={s.footerMeta}>
            {[
              crew.registraton_date && t('crew-profile.registered-on', { date: formatDate(crew.registraton_date) }),
              crew.lastAccessDate && t('crew-profile.last-access', { date: formatDate(crew.lastAccessDate) }),
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        ) : null}
      </ScrollView>

      <PublicPreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} />
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
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 32 },
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
    gap: 14,
    alignItems: 'flex-start',
  },
  avatar: { width: 72, height: 72, borderRadius: 18 },
  avatarPlaceholder: {
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 18, fontWeight: '800', color: C.ink, letterSpacing: -0.3, flex: 1, marginRight: 8 },
  role: { fontSize: 14, fontWeight: '700', color: C.orangeText, marginTop: 3, letterSpacing: -0.1 },
  meta: { fontSize: 12, color: C.ink3, marginTop: 6, lineHeight: 16 },
  availInline: {
    fontSize: 12,
    fontWeight: '500',
    color: C.ink3,
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    flexShrink: 0,
  },
  availDot: { width: 6, height: 6, borderRadius: 99 },
  availText: { fontSize: 11, fontWeight: '600' },
  meterRow: { paddingHorizontal: 18, paddingBottom: 14 },
  meterLabel: { fontSize: 12, fontWeight: '600', color: C.ink3 },
  meterMissing: { fontSize: 12, fontWeight: '600', color: C.orangeText },
  meterTrack: {
    height: 6,
    borderRadius: 99,
    backgroundColor: C.field,
    overflow: 'hidden',
  },
  meterFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 99,
    backgroundColor: C.orange,
  },
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    backgroundColor: '#FAF9F6',
  },
  statValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.6, lineHeight: 26 },
  statSuffix: { fontSize: 11, fontWeight: '600', color: C.ink3, marginBottom: 2 },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  statDivider: { width: 1, backgroundColor: C.hair2, marginVertical: 4, marginHorizontal: 16 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.ink3,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 14,
    paddingHorizontal: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  actionRowLast: { borderBottomWidth: 0 },
  actionRowDisabled: { opacity: 0.45 },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionIconAccent: { backgroundColor: C.orangeSoft },
  actionTitle: { fontSize: 15, fontWeight: '600', color: C.ink, letterSpacing: -0.1 },
  actionSub: { fontSize: 12, color: C.ink3, marginTop: 1 },
  comingSoonBadge: {
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: C.orangeSoft,
  },
  comingSoonText: { fontSize: 10, fontWeight: '700', color: C.orangeText, letterSpacing: 0.2 },
  footerMeta: {
    textAlign: 'center',
    fontSize: 11,
    color: C.ink4,
    letterSpacing: 0.2,
    marginTop: 16,
    marginHorizontal: 22,
  },
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
  notifMessage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 1,
  },
})

export default CrewProfile
