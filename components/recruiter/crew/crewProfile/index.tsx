import { useState, FC, ReactNode } from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  ActionSheetIOS,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  Check,
  AlertTriangle,
  MoreHorizontal,
  Phone,
  Info,
  AlertCircle,
} from 'lucide-react-native'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useStatusToast } from '@/hooks'
// import { getCrewCV, contactCrew, removeCrew } from '@/api'
import { getCrewCvPost, contactCrew, removeCrew } from '@/api'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'
import { Loading } from '@/components/ui'
import { ApiError } from '@/api/utils'
import { C } from '@/components/pro/tokens'
import ContactCrewModal from './ContactCrewModal'
import { TCrewExperience, TCrewReference } from '@/api/types'

const GREEN_SOFT = '#E8F8EB'
const GREEN_TEXT = '#0F7A28'
const WARN_BG = '#FFF7ED'
const WARN_TEXT = '#C2600A'
const WARN_BORDER = '#FDDCB5'
const ORANGE_BG = '#FFF4EC'
const ORANGE_TEXT = '#C05416'

const cp = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    backgroundColor: C.card,
    borderRadius: 18,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: C.ink3,
    letterSpacing: -0.5,
  },
  photoBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: C.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  heroRole: {
    fontSize: 18,
    fontWeight: '700',
    color: C.orangeText,
    letterSpacing: -0.2,
  },
  heroId: {
    fontSize: 12,
    fontWeight: '600',
    color: C.ink4,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  heroName: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
    marginTop: 6,
  },
  heroMeta: {
    fontSize: 12,
    color: C.ink2,
    marginTop: 8,
    lineHeight: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  pillGreen: { backgroundColor: GREEN_SOFT, borderColor: 'transparent' },
  pillWarn: { backgroundColor: WARN_BG, borderColor: WARN_BORDER },
  pillNeutral: { backgroundColor: C.field, borderColor: C.hair },
  pillOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: ORANGE_BG,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillText: { fontSize: 12, fontWeight: '600' },
  quadGrid: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quadCell: { width: '50%', padding: 14 },
  quadLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  quadValue: { fontSize: 13, fontWeight: '700', color: C.ink, marginTop: 2 },
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
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  fieldValue: { fontSize: 14, fontWeight: '500', color: C.ink, lineHeight: 20, marginBottom: 12 },
  fieldValueStrong: { fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  expRow: { paddingVertical: 10 },
  expRowBorder: { borderTopWidth: 1, borderTopColor: C.hair2 },
  expRole: { fontSize: 14, fontWeight: '700', color: C.ink },
  expDates: { fontSize: 11, fontWeight: '500', color: C.ink4, fontVariant: ['tabular-nums'] },
  expMeta: { fontSize: 12, color: C.ink3, marginTop: 2 },
  accordionRow: { paddingVertical: 12 },
  accordionHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  accordionBody: { marginTop: 8 },
  accordionBodyText: { fontSize: 13, lineHeight: 20, color: C.ink2 },
  aboutText: { fontSize: 14, lineHeight: 22, color: C.ink2, fontStyle: 'italic', marginBottom: 8 },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: C.field,
    borderRadius: 10,
    marginBottom: 8,
  },
  emptyStateText: { fontSize: 13, fontWeight: '500', color: C.ink3 },
  refRow: { paddingVertical: 10 },
  refRowBorder: { borderTopWidth: 1, borderTopColor: C.hair2 },
  refRole: { fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2 },
  refMeta: { fontSize: 12, color: C.ink3 },
  refYear: { fontSize: 11, color: C.ink4, marginTop: 2 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
    gap: 12,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.ink4,
    width: 80,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  contactValue: { flex: 1, fontSize: 14, fontWeight: '500', color: C.ink },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.card,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  moreBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.hair,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#22A93A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  contactBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF', letterSpacing: 0.2 },
})

const ExperienceItem: FC<{ exp: TCrewExperience; index: number }> = ({ exp, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <Pressable onPress={() => setOpen((v) => !v)} style={[cp.accordionRow, index > 0 && cp.expRowBorder]}>
      <View style={cp.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={cp.expRole} numberOfLines={open ? undefined : 1}>
            {exp.typeofemployment || '—'}
          </Text>
          {exp.boatcompany || exp.employer ? (
            <Text style={cp.expMeta} numberOfLines={1}>
              {[exp.boatcompany, exp.employer].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={cp.expDates}>{[exp.fromDate, exp.toDate].filter(Boolean).join(' – ')}</Text>
          {open ? (
            <ChevronUp size={14} color={C.ink4} strokeWidth={2} />
          ) : (
            <ChevronDown size={14} color={C.ink4} strokeWidth={2} />
          )}
        </View>
      </View>
      {open && exp.typeofassignment ? (
        <Text style={[cp.accordionBody, cp.accordionBodyText]}>{exp.typeofassignment}</Text>
      ) : null}
    </Pressable>
  )
}

const ReferenceItem: FC<{ ref: TCrewReference; index: number }> = ({ ref, index }) => {
  const [open, setOpen] = useState(false)
  const hasDetail = !!(ref.telephone || ref.email || ref.notes)
  return (
    <Pressable onPress={() => hasDetail && setOpen((v) => !v)} style={[cp.accordionRow, index > 0 && cp.refRowBorder]}>
      <View style={cp.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={cp.refRole} numberOfLines={1}>
            {ref.positionreferent}
          </Text>
          {ref.company_name || ref.yacht ? (
            <Text style={cp.refMeta} numberOfLines={1}>
              {[ref.company_name, ref.yacht].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {ref.yearreference ? <Text style={cp.expDates}>{ref.yearreference}</Text> : null}
          {hasDetail ? (
            open ? (
              <ChevronUp size={14} color={C.ink4} strokeWidth={2} />
            ) : (
              <ChevronDown size={14} color={C.ink4} strokeWidth={2} />
            )
          ) : null}
        </View>
      </View>
      {open && (
        <View style={cp.accordionBody}>
          {ref.telephone ? <Text style={cp.refMeta}>📞 {ref.telephone}</Text> : null}
          {ref.email ? <Text style={cp.refMeta}>✉ {ref.email}</Text> : null}
          {ref.notes ? <Text style={[cp.refMeta, { marginTop: 4 }]}>{ref.notes}</Text> : null}
        </View>
      )}
    </Pressable>
  )
}

const SectionCard: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <View style={cp.sectionCard}>
    <Text style={cp.sectionTitle}>{title}</Text>
    {children}
  </View>
)

const FieldRow: FC<{ label: string; value?: string | null; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={cp.fieldLabel}>{label}</Text>
    <Text style={bold ? cp.fieldValueStrong : cp.fieldValue}>{value || '—'}</Text>
  </View>
)

const CrewProfile = () => {
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const {
    i18n: { language },
    t,
  } = useTranslation(['crew-screen', 'crew', 'screens-labels', 'common', 'offer', 'search-screen'])

  const { crewId, searchId } = useLocalSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { activeProfile } = useUser()
  const { showToast } = useStatusToast()
  const { token } = activeProfile as ActiveProfile

  const { isLoading, isSuccess, isError, isRefetching, refetch, data, error } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId, crewId, language],
    // queryFn: () => getCrewCV(token, crewId as string),
    queryFn: () => {
      console.log('[CrewProfile] token:', token, '| crewId:', crewId, '| searchId:', searchId)
      return getCrewCvPost(crewId as string, token, language)
    },
  })
  const crew = isSuccess ? data?.[0] : null

  const { mutate: handleContactCrew, isPending } = useMutation({
    mutationFn: () => contactCrew(token, crewId as string, searchId as string, language),
    onSuccess: () => {
      showToast({ emphasize: 'success', title: t('success', { ns: 'common' }) })
    },
    onError: () => {
      showToast({ emphasize: 'error', title: 'Error', description: t('contact-crew-error', { ns: 'crew-screen' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] })
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list', searchId] })
      setContactModalVisible(false)
    },
  })

  const { mutate: handleRemoveCrew, isPending: isPendingRemove } = useMutation({
    mutationFn: () => removeCrew(token, crewId as string, searchId as string, language),
    onSuccess: () => {
      showToast({ emphasize: 'success', title: t('success', { ns: 'common' }) })
    },
    onError: () => {
      showToast({ emphasize: 'error', title: 'Error', description: t('remove-crew-error', { ns: 'crew-screen' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] })
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list', searchId] })
      router.back()
    },
  })

  const isActionLoading = isPending || isPendingRemove

  const handleMoreOptions = () => {
    const removeLabel = t('remove-crew', { ns: 'crew-screen' })
    const cancelLabel = t('cancel', { ns: 'common' })
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [cancelLabel, removeLabel], cancelButtonIndex: 0, destructiveButtonIndex: 1 },
        (i) => {
          if (i === 1) handleRemoveCrew()
        }
      )
    } else {
      Alert.alert('', '', [
        { text: removeLabel, style: 'destructive', onPress: () => handleRemoveCrew() },
        { text: cancelLabel, style: 'cancel' },
      ])
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Loading />
      </View>
    )
  }

  if (isError) {
    const apiMessage = error instanceof ApiError ? error.title : undefined
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={cp.navRow}>
          <Pressable style={cp.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
          </Pressable>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
          <AlertCircle size={40} color="#EF4444" strokeWidth={1.6} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#EF4444', textAlign: 'center' }}>
            {apiMessage ?? t('unknown-error', { ns: 'common' })}
          </Text>
        </View>
      </View>
    )
  }

  if (!crew) return null

  const isContacted = crew.contacted === 'True' || crew.contacted === true
  const photoUrl = crew.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const photoCount = [crew.userPhoto, crew.namephotoA, crew.namephotoB, crew.namephotoC].filter(Boolean).length
  const age = crew.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const { hasCertificateOfCompetence } = getCertificateOfCompetence(crew)
  const hasSeamansBook = getSeamansBook(crew)

  const initials = isContacted
    ? ((crew.name?.[0] ?? '') + (crew.surname?.[0] ?? '')).toUpperCase() || '?'
    : (crew.mainPosition?.[0] ?? '?').toUpperCase()

  const otherPositions = [
    crew.pos_deck && `Deck: ${crew.pos_deck}`,
    crew.pos_engine && `Engine: ${crew.pos_engine}`,
    crew.pos_harbour && `Harbour: ${crew.pos_harbour}`,
    crew.pos_hotel && `Hotel: ${crew.pos_hotel}`,
    crew.pos_special && `Special: ${crew.pos_special}`,
  ].filter(Boolean) as string[]

  const languages = [crew.language1, crew.language2, crew.language3, crew.language4].filter(Boolean) as string[]

  const coursesList = crew.courses
    ? crew.courses
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : []

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Nav bar */}
      <View style={cp.navRow}>
        <Pressable style={cp.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
        </Pressable>
        <Text style={cp.navTitle}>CV #{crew.iduser}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Hero card */}
        <View style={cp.card}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <View style={{ position: 'relative' }}>
              <View style={cp.avatar}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={cp.avatarImg} />
                ) : (
                  <Text style={cp.avatarInitials}>{initials}</Text>
                )}
              </View>
              {photoCount > 0 && (
                <View style={cp.photoBadge}>
                  <Text style={cp.photoBadgeText}>{photoCount}</Text>
                </View>
              )}
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={cp.heroRole} numberOfLines={2}>
                {crew.mainPosition || '—'}
              </Text>
              <Text style={cp.heroId}>ID · {crew.iduser}</Text>
              {isContacted && (
                <Text style={cp.heroName}>
                  {crew.name} {crew.surname}
                </Text>
              )}
              <Text style={cp.heroMeta} numberOfLines={3}>
                {[
                  crew.passport,
                  crew.city,
                  age ? `${age} ${t('years', { ns: 'crew' })}` : null,
                  crew.maritalStatus,
                  crew.gender,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </View>
          </View>

          {/* Status pills */}
          <View style={cp.pillsRow}>
            {hasSeamansBook && (
              <View style={[cp.pill, cp.pillGreen]}>
                <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
                <Text style={[cp.pillText, { color: GREEN_TEXT }]}>{t('seaman-book')}</Text>
              </View>
            )}
            {hasCertificateOfCompetence ? (
              <View style={[cp.pill, cp.pillGreen]}>
                <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
                <Text style={[cp.pillText, { color: GREEN_TEXT }]}>{t('coc-valid')}</Text>
              </View>
            ) : (
              <View style={[cp.pill, cp.pillWarn]}>
                <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
                <Text style={[cp.pillText, { color: WARN_TEXT }]}>{t('no-coc')}</Text>
              </View>
            )}
            {coursesList.length > 0 ? (
              <View style={[cp.pill, cp.pillNeutral]}>
                <Text style={[cp.pillText, { color: C.ink2 }]}>
                  {t('courses-count', { count: coursesList.length })}
                </Text>
              </View>
            ) : (
              <View style={[cp.pill, cp.pillWarn]}>
                <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
                <Text style={[cp.pillText, { color: WARN_TEXT }]}>{t('no-courses-short')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quad facts grid */}
        <View style={cp.quadGrid}>
          {(
            [
              { Icon: Calendar, label: t('available-from', { ns: 'crew' }), value: crew.dateAvailability },
              { Icon: Briefcase, label: t('experience', { ns: 'crew' }), value: crew.calculatedExperience },
              { Icon: DollarSign, label: t('salary', { ns: 'offer' }), value: crew.salary },
              { Icon: Clock, label: t('last-seen', { ns: 'crew' }), value: crew.lastAccessDate },
            ] as const
          ).map(({ Icon, label, value }, i) => (
            <View
              key={label}
              style={[
                cp.quadCell,
                i % 2 === 0 && { borderRightWidth: 1, borderRightColor: C.hair2 },
                i < 2 && { borderBottomWidth: 1, borderBottomColor: C.hair2 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Icon size={13} color={C.ink4} strokeWidth={1.8} />
                <Text style={cp.quadLabel}>{label}</Text>
              </View>
              <Text style={cp.quadValue}>{value || '—'}</Text>
            </View>
          ))}
        </View>

        {/* Roles & positions */}
        <SectionCard title={t('roles-and-positions')}>
          <FieldRow label={t('main-position', { ns: 'offer' })} value={crew.mainPosition} bold />
          {crew.specseling ? (
            <FieldRow label={t('position-specialty', { ns: 'offer' })} value={crew.specseling} />
          ) : null}
          {otherPositions.length > 0 && (
            <>
              <Text style={cp.fieldLabel}>{t('other-roles')}</Text>
              <View style={cp.tagsRow}>
                {otherPositions.map((p) => (
                  <View key={p} style={[cp.pill, cp.pillNeutral]}>
                    <Text style={[cp.pillText, { color: C.ink2 }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </SectionCard>

        {/* Languages & education */}
        {(languages.length > 0 || !!crew.educationalLevel || coursesList.length > 0) && (
          <SectionCard title={t('languages-and-education')}>
            {languages.length > 0 && (
              <>
                <Text style={cp.fieldLabel}>{t('languages', { ns: 'crew' })}</Text>
                <View style={cp.tagsRow}>
                  {languages.map((l) => (
                    <View key={l} style={[cp.pill, cp.pillNeutral]}>
                      <Text style={[cp.pillText, { color: C.ink2 }]}>{l}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            {crew.educationalLevel ? (
              <FieldRow label={t('education', { ns: 'crew' })} value={crew.educationalLevel} />
            ) : null}
            {coursesList.length > 0 && (
              <>
                <Text style={cp.fieldLabel}>{t('corses-and-certificates')}</Text>
                <View style={cp.tagsRow}>
                  {coursesList.map((c) => (
                    <View key={c} style={cp.pillOrange}>
                      <Text style={[cp.pillText, { color: ORANGE_TEXT }]}>{c}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </SectionCard>
        )}

        {/* Experiences */}
        <SectionCard title={t('experience', { ns: 'crew' })}>
          {(crew.experiences?.length ?? 0) === 0 ? (
            <View style={cp.emptyState}>
              <Info size={14} color={C.ink3} strokeWidth={1.8} />
              <Text style={cp.emptyStateText}>{t('no-experience', { ns: 'crew' })}</Text>
            </View>
          ) : (
            [...crew.experiences]
              .sort((a, b) => {
                const parse = (d: string) => new Date(d?.split('/').reverse().join('-') ?? '').getTime()
                return parse(b.toDate) - parse(a.toDate)
              })
              .map((e, i) => <ExperienceItem key={e.idesperienza} exp={e} index={i} />)
          )}
        </SectionCard>

        {/* Skills */}
        {(crew.relationalSkills || crew.organizationalSkills || crew.technicalSkills || crew.professionalSkills) && (
          <SectionCard title={t('skills-and-abilities')}>
            {[
              { label: t('soft-skills', { ns: 'crew' }), value: crew.relationalSkills },
              { label: t('organizational-skills', { ns: 'crew' }), value: crew.organizationalSkills },
              { label: t('technical-skills', { ns: 'crew' }), value: crew.technicalSkills },
              { label: t('further-abilities', { ns: 'crew' }), value: crew.professionalSkills },
            ]
              .filter(({ value }) => !!value)
              .map(({ label, value }) => (
                <View key={label} style={{ marginBottom: 12 }}>
                  <Text style={cp.fieldLabel}>{label}</Text>
                  <Text style={cp.fieldValue}>{value}</Text>
                </View>
              ))}
          </SectionCard>
        )}

        {/* About */}
        {crew.curriculum ? (
          <SectionCard title={t('about', { ns: 'crew' })}>
            <Text style={cp.aboutText}>"{crew.curriculum}"</Text>
          </SectionCard>
        ) : null}

        {/* References */}
        <SectionCard title={t('references', { ns: 'crew' })}>
          {!crew.approvedReferences?.length ? (
            <View style={cp.emptyState}>
              <Info size={14} color={C.ink3} strokeWidth={1.8} />
              <Text style={cp.emptyStateText}>{t('no-references')}</Text>
            </View>
          ) : (
            crew.approvedReferences.map((ref, i) => <ReferenceItem key={ref.idReference} ref={ref} index={i} />)
          )}
        </SectionCard>

        {/* Contact info — visible only when contacted */}
        {isContacted && (
          <SectionCard title={t('contact-information', { ns: 'crew' })}>
            {[
              { label: t('email', { ns: 'crew' }), value: crew.email || crew.emailCc },
              { label: t('phone', { ns: 'crew' }), value: crew.telephone },
              { label: t('cellular', { ns: 'crew' }), value: crew.cellular },
              { label: t('whatsapp', { ns: 'crew' }), value: crew.callWhatsapp },
            ]
              .filter(({ value }) => !!value)
              .map(({ label, value }) => (
                <View key={label} style={cp.contactRow}>
                  <Text style={cp.contactLabel}>{label}</Text>
                  <Text style={cp.contactValue}>{value}</Text>
                </View>
              ))}
          </SectionCard>
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={cp.actionBar}>
        <Pressable
          style={[cp.moreBtn, isActionLoading && { opacity: 0.5 }]}
          onPress={handleMoreOptions}
          disabled={isActionLoading}
        >
          <MoreHorizontal size={20} color={C.ink2} strokeWidth={1.8} />
        </Pressable>
        <Pressable
          style={[cp.contactBtn, isActionLoading && { opacity: 0.6 }]}
          onPress={() => setContactModalVisible(true)}
          disabled={isActionLoading}
        >
          <Phone size={18} color="#FFF" strokeWidth={2} />
          <Text style={cp.contactBtnText}>{t('contact-crew')}</Text>
        </Pressable>
      </View>

      <ContactCrewModal
        visible={contactModalVisible}
        crew={crew}
        onClose={() => setContactModalVisible(false)}
        onConfirm={handleContactCrew}
      />
    </View>
  )
}

export default CrewProfile

CrewProfile.displayName = 'CrewProfile'
