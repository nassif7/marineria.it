import { useState, FC, ReactNode } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Linking } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  Euro,
  Clock,
  Check,
  AlertTriangle,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Info,
  AlertCircle,
  Headphones,
  Send,
} from 'lucide-react-native'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { useStatusToast, useManualRefresh } from '@/hooks'
// import { getCrewCV, contactCrew, removeCrew } from '@/api'
import { getCrewCvPost, contactCrew, removeCrew, supportTeam } from '@/api'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'
import { Loading, RefreshControl } from '@/components/ui'
import { ApiError, parseServerBool } from '@/api/utils'
import { C } from '@/components/pro/tokens'
import ContactSupport from '@/components/common/ContactSupport'
import { PhotoSlider } from '@/components/appUI'
import HtmlText from '@/components/pro/HtmlText'
import ContactCrewModal from './ContactCrewModal'
import RemoveCrewModal from './RemoveCrewModal'
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
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
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
  refDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  refDetailIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  refDetailText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
  },
  refNotes: {
    fontSize: 13,
    lineHeight: 19,
    color: C.ink2,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  contactRowLast: { borderBottomWidth: 0 },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  contactValue: { fontSize: 14, fontWeight: '600', color: C.ink },
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
  smallBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.hair,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
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
        <HtmlText style={{ ...cp.accordionBody, ...cp.accordionBodyText }}>{exp.typeofassignment}</HtmlText>
      ) : null}
    </Pressable>
  )
}

const ReferenceItem: FC<{ ref: TCrewReference; index: number; isContacted: boolean }> = ({
  ref,
  index,
  isContacted,
}) => {
  const [open, setOpen] = useState(false)
  const hasContactDetail = isContacted && !!(ref.telephone || ref.email)
  const hasDetail = hasContactDetail || !!ref.notes
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
          {hasContactDetail && ref.telephone ? (
            <View style={cp.refDetailRow}>
              <View style={cp.refDetailIcon}>
                <Phone size={13} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={cp.refDetailText}>{ref.telephone}</Text>
            </View>
          ) : null}
          {hasContactDetail && ref.email ? (
            <View style={cp.refDetailRow}>
              <View style={cp.refDetailIcon}>
                <Mail size={13} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={cp.refDetailText}>{ref.email}</Text>
            </View>
          ) : null}
          {ref.notes ? <Text style={cp.refNotes}>{ref.notes}</Text> : null}
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

const ContactInfoRow: FC<{ icon: FC<any>; label: string; value: string; onPress: () => void; last?: boolean }> = ({
  icon: Icon,
  label,
  value,
  onPress,
  last,
}) => (
  <Pressable style={[cp.contactRow, last && cp.contactRowLast]} onPress={onPress}>
    <View style={cp.contactIcon}>
      <Icon size={16} color={C.orange} strokeWidth={1.8} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={cp.contactLabel}>{label}</Text>
      <Text style={cp.contactValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
    <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
  </Pressable>
)

const CrewProfile = () => {
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [photoSliderVisible, setPhotoSliderVisible] = useState(false)
  const [photoSliderIndex, setPhotoSliderIndex] = useState(0)
  const {
    i18n: { language },
    t,
  } = useTranslation(['crew-screen', 'crew', 'screens-labels', 'common', 'offer', 'search-screen'])

  const { crewId, searchId } = useLocalSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { token } = useRecruiter()
  const { showToast } = useStatusToast()

  const { isLoading, isSuccess, isError, refetch, data, error } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId, crewId, language],
    // queryFn: () => getCrewCV(token, crewId as string),
    queryFn: () => {
      return getCrewCvPost(crewId as string, token, language)
    },
  })
  const crew = isSuccess ? data : null
  const { refreshing, onRefresh } = useManualRefresh(refetch)

  const { mutate: handleContactCrew, isPending } = useMutation({
    mutationFn: () => contactCrew(token, crewId as string, searchId as string, language),
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('contact-crew-success', { ns: 'crew-screen' }),
        duration: 8000,
      })
    },
    onError: (error: unknown) => {
      console.log('handleContactCrew error', error)
      const message = error instanceof ApiError && error.title !== 'unknown-error' ? error.title : null
      showToast({
        emphasize: 'error',
        title: 'Error',
        description: message ?? t('contact-crew-error', { ns: 'crew-screen' }),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] })
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list-post', searchId] })
      setContactModalVisible(false)
    },
  })

  const { mutate: handleRemoveCrew, isPending: isPendingRemove } = useMutation({
    mutationFn: () => removeCrew(token, crewId as string, searchId as string, language),
    onSuccess: async () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('remove-crew-success', { ns: 'crew-screen' }),
        duration: 8000,
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] }),
        queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list-post', searchId] }),
      ])
      setRemoveModalVisible(false)
      router.back()
    },
    onError: (error: unknown) => {
      console.log('handleRemoveCrew error', error)
      const message = error instanceof ApiError && error.title !== 'unknown-error' ? error.title : null
      showToast({
        emphasize: 'error',
        title: 'Error',
        description: message ?? t('remove-crew-error', { ns: 'crew-screen' }),
      })
    },
  })

  const isActionLoading = isPending || isPendingRemove

  const handleOpenContact = (url: string) => {
    // Note: Linking.canOpenURL() unreliably returns false for mailto:/tel: on iOS unless the
    // scheme is declared in LSApplicationQueriesSchemes, so we call openURL directly and just
    // swallow the rejection it throws when there's genuinely no app to handle it.
    Linking.openURL(url).catch(() => {})
  }

  const handleRemovePress = () => setRemoveModalVisible(true)

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
          <ContactSupport
            title={t('contact-support', { ns: 'settings-screen' })}
            supportTeam={supportTeam}
            renderTrigger={({ onPress }) => (
              <Pressable style={cp.iconBtn} onPress={onPress}>
                <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
              </Pressable>
            )}
          />
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

  if (!crew.iduser) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={cp.navRow}>
          <Pressable style={cp.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
          </Pressable>
          <ContactSupport
            title={t('contact-support', { ns: 'settings-screen' })}
            supportTeam={supportTeam}
            renderTrigger={({ onPress }) => (
              <Pressable style={cp.iconBtn} onPress={onPress}>
                <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
              </Pressable>
            )}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
          <AlertCircle size={40} color={C.ink4} strokeWidth={1.6} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, textAlign: 'center' }}>
            {t('profile-not-available', { ns: 'crew-screen' })}
          </Text>
          <Text style={{ fontSize: 14, color: C.ink3, textAlign: 'center', lineHeight: 20 }}>
            {t('profile-not-available-description', { ns: 'crew-screen' })}
          </Text>
        </View>
      </View>
    )
  }

  const isContacted = parseServerBool(crew.contacted)
  const photoUrl = crew.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const photos = [crew.userPhoto, crew.namephotoA, crew.namephotoB, crew.namephotoC]
    .filter((p): p is string => !!p)
    .map((p) => getPhotoUrl(p))
  const photoCount = photos.length
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

  // The backend sometimes returns a full wa.me URL here instead of a bare number — strip it for display.
  const waNumber = crew.callWhatsapp?.replace(/^https?:\/\/wa\.me\//i, '') ?? ''

  const contactEntries = [
    {
      icon: Mail,
      label: t('email', { ns: 'crew' }),
      value: crew.email || crew.emailCc,
      href: (v: string) => `mailto:${v}`,
    },
    {
      icon: Phone,
      label: t('cellular', { ns: 'crew' }),
      value: crew.cellular,
      href: (v: string) => `tel:${v.replace(/\s/g, '')}`,
    },
    {
      icon: MessageCircle,
      label: t('whatsapp', { ns: 'crew' }),
      value: waNumber,
      href: (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`,
    },
  ].filter((entry): entry is typeof entry & { value: string } => !!entry.value)

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Nav bar */}
      <View style={cp.navRow}>
        <Pressable style={cp.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
        </Pressable>
        <Text style={cp.navTitle}>CV #{crew.iduser}</Text>
        <ContactSupport
          title={t('contact-support', { ns: 'settings-screen' })}
          supportTeam={supportTeam}
          renderTrigger={({ onPress }) => (
            <Pressable style={cp.iconBtn} onPress={onPress}>
              <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
            </Pressable>
          )}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero card */}
        <View style={cp.card}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
            <Pressable
              style={{ position: 'relative' }}
              disabled={photoCount === 0}
              onPress={() => {
                setPhotoSliderIndex(0)
                setPhotoSliderVisible(true)
              }}
            >
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
            </Pressable>

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
            {isContacted && (
              <View style={cp.pillOrange}>
                <Send size={10} color={ORANGE_TEXT} strokeWidth={2.4} />
                <Text style={[cp.pillText, { color: ORANGE_TEXT }]}>
                  {t('already-contacted', { ns: 'crew-screen' })}
                </Text>
              </View>
            )}
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

        {/* Contact info — visible only when contacted */}
        {isContacted && contactEntries.length > 0 && (
          <SectionCard title={t('contact-information', { ns: 'crew' })}>
            {contactEntries.map((entry, i) => (
              <ContactInfoRow
                key={entry.label}
                icon={entry.icon}
                label={entry.label}
                value={entry.value}
                onPress={() => handleOpenContact(entry.href(entry.value))}
                last={i === contactEntries.length - 1}
              />
            ))}
          </SectionCard>
        )}

        {/* Quad facts grid */}
        <View style={cp.quadGrid}>
          {(
            [
              { Icon: Calendar, label: t('available-from', { ns: 'crew' }), value: crew.dateAvailability },
              { Icon: Briefcase, label: t('experience', { ns: 'crew' }), value: crew.calculatedExperience },
              { Icon: Euro, label: t('salary', { ns: 'offer' }), value: crew.salary },
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
                  {languages.map((l, i) => (
                    <View key={`${l}-${i}`} style={[cp.pill, cp.pillNeutral]}>
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
                  {coursesList.map((c, i) => (
                    <View key={`${c}-${i}`} style={cp.pillOrange}>
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
            <HtmlText style={cp.aboutText}>{`"${crew.curriculum}"`}</HtmlText>
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
            crew.approvedReferences.map((ref, i) => (
              <ReferenceItem key={ref.idReference} ref={ref} index={i} isContacted={isContacted} />
            ))
          )}
        </SectionCard>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={cp.actionBar}>
        <Pressable
          style={[cp.smallBtn, cp.removeBtn, isActionLoading && { opacity: 0.5 }]}
          onPress={handleRemovePress}
          disabled={isActionLoading}
        >
          <Trash2 size={18} color="#DC2626" strokeWidth={1.8} />
        </Pressable>
        <Pressable
          style={[cp.contactBtn, (isActionLoading || isContacted) && { opacity: 0.6 }]}
          onPress={() => setContactModalVisible(true)}
          disabled={isActionLoading || isContacted}
        >
          <Text style={cp.contactBtnText}>
            {isContacted ? t('already-contacted', { ns: 'crew-screen' }) : t('contact-crew')}
          </Text>
        </Pressable>
      </View>

      <ContactCrewModal
        visible={contactModalVisible}
        crew={crew}
        onClose={() => setContactModalVisible(false)}
        onConfirm={handleContactCrew}
        isSubmitting={isPending}
      />
      <RemoveCrewModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={handleRemoveCrew}
        isSubmitting={isPendingRemove}
      />
      <PhotoSlider
        visible={photoSliderVisible}
        photos={photos}
        initialIndex={photoSliderIndex}
        onClose={() => setPhotoSliderVisible(false)}
      />
    </View>
  )
}

export default CrewProfile

CrewProfile.displayName = 'CrewProfile'
