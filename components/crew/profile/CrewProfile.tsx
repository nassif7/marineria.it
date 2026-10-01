import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  Edit2,
  ChevronRight,
  Check,
  AlertTriangle,
  Users,
  FileText,
  FileDown,
  Calendar,
  Bell,
} from 'lucide-react-native'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import ToggleSwitch from '@/components/common/ToggleSwitch/ToggleSwitch'
import { useCrew } from '@/Providers/CrewProvider'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import {
  getCertificateOfCompetence,
  getSeamansBook,
  getCoursesCount,
  getCrewAvailability,
  getGenderEnding,
} from '@/utils/crewUtils'
import { C } from '@/components/appUI/tokens'
import { Loading, RefreshControl } from '@/components/ui'
import { useManualRefresh, useAuthBrowser, useAuthDownload } from '@/hooks'
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

const tomorrow = (): Date => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d
}

// The availability API expects availableFrom as yyyy-mm-dd.
const toISODateString = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
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
  loading?: boolean
  onPress?: () => void
}> = ({ icon: Icon, title, sub, accent, last, disabled, loading, onPress }) => {
  const { t } = useTranslation('home-screen')
  return (
    <Pressable
      style={[s.actionRow, last && s.actionRowLast, disabled && s.actionRowDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
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
      ) : loading ? (
        <ActivityIndicator size="small" color={C.ink4} />
      ) : (
        <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
      )}
    </Pressable>
  )
}

// ── Main screen ─────────────────────────────────────────────

const CrewProfile: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation('home-screen')
  const router = useRouter()
  const {
    crew,
    notifications,
    isLoading,
    refetch,
    availability,
    isLoadingAvailability,
    updateAvailability,
    isUpdatingAvailability,
  } = useCrew()

  const { refreshing, onRefresh } = useManualRefresh(refetch)
  const { openUrl } = useAuthBrowser()
  const { downloadPdf, isLoading: isDownloadingPdf } = useAuthDownload()
  const [previewVisible, setPreviewVisible] = useState(false)

  const displayName =
    [crew?.name, crew?.surname].filter(Boolean).join(' ') || (crew?.iduser ? `ID · ${crew.iduser}` : '')
  const age = crew?.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const photoUrl = crew?.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const { hasCertificateOfCompetence } = useMemo(
    () => (crew ? getCertificateOfCompetence(crew as any) : { hasCertificateOfCompetence: false }),
    [crew]
  )
  const hasSeamansBook = crew ? getSeamansBook(crew as any) : false
  const coursesCount = useMemo(() => getCoursesCount(crew?.courses), [crew?.courses])
  const languages = useMemo(
    () => [crew?.language1, crew?.language2, crew?.language3, crew?.language4].filter((l): l is string => !!l),
    [crew]
  )
  const { missing } = useMemo(() => (crew ? calcCompletion(crew as any) : { pct: 0, missing: 0 }), [crew])

  // Combines the availability flag with the available-from date: available is only true when the
  // flag says yes AND the date hasn't passed. When the flag says yes but the date has passed, the
  // description flags that distinctly from a plain "not available". Sourced from the dedicated
  // GetAvailability endpoint, not the main profile response — that one's availability fields
  // have proven unreliable (stale flag, inconsistent date formats).
  const {
    isAvailable,
    date: availableDate,
    description: availabilityDescription,
    status: availabilityStatus,
  } = getCrewAvailability(availability?.available === 1, availability?.dateavailability, language, t, crew?.gender)

  const [iosPickerVisible, setIosPickerVisible] = useState(false)
  const [iosPickerDraft, setIosPickerDraft] = useState(tomorrow)

  // Seed the picker from the existing available-from date when it's still a valid future date,
  // otherwise fall back to tomorrow.
  const initialAvailableFromDate = (): Date => {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    return availableDate && availableDate.getTime() >= todayStart.getTime() ? availableDate : tomorrow()
  }

  const saveAvailability = async (available: boolean, availableFrom?: Date) => {
    try {
      await updateAvailability({ available, availableFrom: availableFrom ? toISODateString(availableFrom) : undefined })
    } catch {
      Alert.alert(t('unknown-error', { ns: 'common' }))
    }
  }

  const openAndroidAvailableFromPicker = () => {
    DateTimePickerAndroid.open({
      value: initialAvailableFromDate(),
      mode: 'date',
      minimumDate: new Date(),
      onChange: (_, date) => {
        if (date) saveAvailability(true, date)
      },
    })
  }

  const openAvailableFromPicker = () => {
    if (Platform.OS === 'android') {
      openAndroidAvailableFromPicker()
    } else {
      setIosPickerDraft(initialAvailableFromDate())
      setIosPickerVisible(true)
    }
  }

  // Once per app open: if the availability date has already expired by the time the crew
  // lands here, prompt them to update it right away instead of waiting for them to notice.
  const hasShownExpiredAlertRef = useRef(false)
  useEffect(() => {
    if (isLoadingAvailability || hasShownExpiredAlertRef.current || availabilityStatus !== 'expired') return
    hasShownExpiredAlertRef.current = true
    Alert.alert(
      t('crew-profile.availability-reminder-title'),
      t('crew-profile.availability-expired', { genderEnding: getGenderEnding(crew?.gender) }),
      [
        { text: t('crew-profile.availability-update'), isPreferred: true, onPress: openAvailableFromPicker },
        {
          text: t('crew-profile.availability-set-unavailable'),
          style: 'destructive',
          onPress: () => saveAvailability(false),
        },
      ]
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingAvailability, availabilityStatus])

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Loading />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
              <Text style={s.name}>{displayName}</Text>

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

          {/* Availability toggle — turning it on opens the date picker first, turning it off is immediate */}
          <View style={s.availRow}>
            <View style={[s.actionIcon, isAvailable && s.actionIconGreen]}>
              {isAvailable ? (
                <Check size={18} color={GREEN_TEXT} strokeWidth={2.4} />
              ) : (
                <Calendar size={18} color={C.ink2} strokeWidth={1.8} />
              )}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.actionTitle}>
                {isAvailable ? t('crew-profile.available') : t('crew-profile.not-available')}
              </Text>
              {isAvailable ? (
                <Pressable style={s.availEditRow} onPress={openAvailableFromPicker} disabled={isUpdatingAvailability}>
                  <Text style={s.availFromGreen}>{availabilityDescription}</Text>
                  <Edit2 size={12} color={GREEN_TEXT} strokeWidth={2} />
                </Pressable>
              ) : (
                <Text style={s.actionSub}>{availabilityDescription}</Text>
              )}
            </View>
            <ToggleSwitch
              enabled={isAvailable}
              isPending={isUpdatingAvailability || isLoadingAvailability}
              activeColor={GREEN_TEXT}
              onToggle={() => (isAvailable ? saveAvailability(false) : openAvailableFromPicker())}
            />
          </View>

          {Platform.OS === 'ios' && (
            <Modal
              visible={iosPickerVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setIosPickerVisible(false)}
            >
              <Pressable style={s.sheetBackdrop} onPress={() => setIosPickerVisible(false)}>
                <Pressable style={s.sheetCard} onPress={(e) => e.stopPropagation()}>
                  <View style={s.sheetHeader}>
                    <Pressable onPress={() => setIosPickerVisible(false)}>
                      <Text style={s.sheetCancelText}>{t('cancel', { ns: 'common' })}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setIosPickerVisible(false)
                        saveAvailability(true, iosPickerDraft)
                      }}
                    >
                      <Text style={s.sheetDoneText}>{t('confirm', { ns: 'common' })}</Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={iosPickerDraft}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={(_, date) => date && setIosPickerDraft(date)}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          )}

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
          const unreadCount = real.filter((n) => !n.isread).length
          const hasUnread = unreadCount > 0
          const isActionable = real.length > 0
          const Banner = isActionable ? Pressable : View
          return (
            <Banner style={s.notifBanner} onPress={isActionable ? () => router.push('/notifications') : undefined}>
              <View style={s.notifIcon}>
                <Bell size={18} color="#fff" strokeWidth={2} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                {hasUnread ? (
                  <Text style={s.notifTitle}>{t('crew-profile.notifications-new-count', { count: unreadCount })}</Text>
                ) : real.length > 0 ? (
                  <Text style={s.notifTitle}>{t('crew-profile.notifications-count', { count: real.length })}</Text>
                ) : (
                  <Text style={s.notifTitle}>{t('crew-profile.no-notifications')}</Text>
                )}
              </View>
              {isActionable && <ChevronRight size={18} color="#fff" strokeWidth={2.4} />}
            </Banner>
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
            {coursesCount > 0 && <Chip tone="orange" label={t('crew-profile.courses', { count: coursesCount })} />}
          </View>
        </View>

        {/* Languages */}
        {languages.length > 0 && (
          <>
            <Text style={s.eyebrow}>{t('crew-profile.section-languages')}</Text>
            <View style={s.rowCard}>
              <View style={s.chipsRow}>
                {languages.map((lang, i) => (
                  <Chip key={i} tone="neutral" label={lang} />
                ))}
              </View>
            </View>
          </>
        )}

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
            icon={FileDown}
            title={t('crew-profile.action-download-pdf')}
            sub={t('crew-profile.action-download-pdf-sub')}
            loading={isDownloadingPdf}
            onPress={async () => {
              try {
                await downloadPdf(
                  `https://www.marineria.it/${language}/Pro/GetCv.aspx?idutente=${crew?.iduser}`,
                  `CV-${(displayName || String(crew?.iduser)).replace(/[^\p{L}\p{N}]+/gu, '-')}.pdf`
                )
              } catch {
                Alert.alert(t('unknown-error', { ns: 'common' }))
              }
            }}
          />
          <ActionRow
            icon={Edit2}
            title={t('crew-profile.action-edit')}
            sub={missing > 0 ? t('crew-profile.action-edit-sub', { count: missing }) : undefined}
            accent
            onPress={async () => {
              // The browser only tells us it closed, not whether anything changed — refetch
              // unconditionally so any edits made on the web page show up immediately.
              await openUrl(`https://www.marineria.it/${language}/Cv.aspx/${crew?.iduser}`)
              refetch()
            }}
          />
          <ActionRow
            icon={FileText}
            title={t('crew-profile.action-docs')}
            sub={t('crew-profile.action-docs-sub', { count: coursesCount })}
            disabled
          />
          <ActionRow
            icon={Calendar}
            title={t('crew-profile.action-availability')}
            sub={availabilityDescription}
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
  scrollContent: { paddingTop: 16, paddingBottom: 32 },
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
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(13,27,42,0.35)',
  },
  sheetCard: {
    backgroundColor: C.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  sheetCancelText: { fontSize: 16, fontWeight: '600', color: C.ink3 },
  sheetDoneText: { fontSize: 16, fontWeight: '700', color: C.orange },
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
    borderRadius: 10,
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
  actionIconGreen: { backgroundColor: GREEN_SOFT },
  actionTitle: { fontSize: 15, fontWeight: '600', color: C.ink, letterSpacing: -0.1 },
  actionSub: { fontSize: 12, color: C.ink3, marginTop: 1 },
  availEditRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1, alignSelf: 'flex-start' },
  availFromGreen: { fontSize: 12, fontWeight: '600', color: GREEN_TEXT },
  comingSoonBadge: {
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
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
})

export default CrewProfile
