import { FC, useState, ReactNode } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  Euro,
  Clock,
  Check,
  AlertTriangle,
  Info,
  AlertCircle,
} from 'lucide-react-native'
import { getCrewPublicCv } from '@/api/pro'
import { getPhotoUrl } from '@/api/consts'
import { ApiError } from '@/api/utils'
import { TCrewExperience, TCrewReference } from '@/api/types'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'
import { Loading, RefreshControl } from '@/components/ui'
import { C } from '@/components/pro/tokens'
import HtmlText from '@/components/pro/HtmlText'
import { useCrew } from '@/Providers/CrewProvider'
import { useManualRefresh } from '@/hooks'

const GREEN_SOFT = '#E8F8EB'
const GREEN_TEXT = '#0F7A28'
const WARN_BG = '#FFF7ED'
const WARN_TEXT = '#C2600A'
const WARN_BORDER = '#FDDCB5'
const ORANGE_BG = '#FFF4EC'
const ORANGE_TEXT = '#C05416'

const ExperienceItem: FC<{ exp: TCrewExperience; index: number }> = ({ exp, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <Pressable onPress={() => setOpen((v) => !v)} style={[pv.accordionRow, index > 0 && pv.expRowBorder]}>
      <View style={pv.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={pv.expRole} numberOfLines={open ? undefined : 1}>
            {exp.typeofemployment || '—'}
          </Text>
          {exp.boatcompany || exp.employer ? (
            <Text style={pv.expMeta} numberOfLines={1}>
              {[exp.boatcompany, exp.employer].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={pv.expDates}>{[exp.fromDate, exp.toDate].filter(Boolean).join(' – ')}</Text>
          {open ? (
            <ChevronUp size={14} color={C.ink4} strokeWidth={2} />
          ) : (
            <ChevronDown size={14} color={C.ink4} strokeWidth={2} />
          )}
        </View>
      </View>
      {open && exp.typeofassignment ? (
        <HtmlText style={{ ...pv.accordionBody, ...pv.accordionBodyText }}>{exp.typeofassignment}</HtmlText>
      ) : null}
    </Pressable>
  )
}

const ReferenceItem: FC<{ ref: TCrewReference; index: number }> = ({ ref, index }) => {
  const [open, setOpen] = useState(false)
  const hasDetail = !!(ref.telephone || ref.email || ref.notes)
  return (
    <Pressable onPress={() => hasDetail && setOpen((v) => !v)} style={[pv.accordionRow, index > 0 && pv.refRowBorder]}>
      <View style={pv.accordionHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={pv.refRole} numberOfLines={1}>
            {ref.positionreferent}
          </Text>
          {ref.company_name || ref.yacht ? (
            <Text style={pv.refMeta} numberOfLines={1}>
              {[ref.company_name, ref.yacht].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {ref.yearreference ? <Text style={pv.expDates}>{ref.yearreference}</Text> : null}
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
        <View style={pv.accordionBody}>
          {ref.telephone ? <Text style={pv.refMeta}>📞 {ref.telephone}</Text> : null}
          {ref.email ? <Text style={pv.refMeta}>✉ {ref.email}</Text> : null}
          {ref.notes ? <Text style={[pv.refMeta, { marginTop: 4 }]}>{ref.notes}</Text> : null}
        </View>
      )}
    </Pressable>
  )
}

const SectionCard: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <View style={pv.sectionCard}>
    <Text style={pv.sectionTitle}>{title}</Text>
    {children}
  </View>
)

const FieldRow: FC<{ label: string; value?: string | null; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={pv.fieldLabel}>{label}</Text>
    <Text style={bold ? pv.fieldValueStrong : pv.fieldValue}>{value || '—'}</Text>
  </View>
)

interface PublicPreviewModalProps {
  visible: boolean
  onClose: () => void
}

const PublicPreviewModal: FC<PublicPreviewModalProps> = ({ visible, onClose }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['home-screen', 'crew-screen', 'crew', 'offer', 'common'])
  const { top, bottom } = useSafeAreaInsets()
  const { crew: homeCrew } = useCrew()
  const userId = homeCrew?.iduser

  const { isLoading, isSuccess, isError, refetch, data, error } = useQuery({
    queryKey: ['crew-public-cv', userId, language],
    queryFn: () => getCrewPublicCv(userId as number, language),
    enabled: visible && !!userId,
  })
  const { refreshing, onRefresh } = useManualRefresh(refetch)
  const crew = isSuccess ? data : null

  const photoUrl = crew?.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const photoCount = crew
    ? [crew.userPhoto, crew.namephotoA, crew.namephotoB, crew.namephotoC].filter(Boolean).length
    : 0
  const age = crew?.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const { hasCertificateOfCompetence } = crew ? getCertificateOfCompetence(crew) : { hasCertificateOfCompetence: false }
  const hasSeamansBook = crew ? getSeamansBook(crew) : false
  const initials = ((crew?.name?.[0] ?? '') + (crew?.surname?.[0] ?? '')).toUpperCase() || '?'

  const otherPositions = crew
    ? ([
        crew.pos_deck && `Deck: ${crew.pos_deck}`,
        crew.pos_engine && `Engine: ${crew.pos_engine}`,
        crew.pos_harbour && `Harbour: ${crew.pos_harbour}`,
        crew.pos_hotel && `Hotel: ${crew.pos_hotel}`,
        crew.pos_special && `Special: ${crew.pos_special}`,
      ].filter(Boolean) as string[])
    : []

  const languages = crew
    ? ([crew.language1, crew.language2, crew.language3, crew.language4].filter(Boolean) as string[])
    : []

  const coursesList = crew?.courses
    ? crew.courses
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : []

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[pv.container, { paddingTop: top }]}>
        {/* Header */}
        <View style={pv.header}>
          <Text style={pv.headerTitle}>{t('crew-profile.action-preview', { ns: 'home-screen' })}</Text>
          <Pressable style={pv.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        {isLoading && (
          <View style={{ flex: 1 }}>
            <Loading />
          </View>
        )}

        {isError && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
            <AlertCircle size={40} color="#EF4444" strokeWidth={1.6} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#EF4444', textAlign: 'center' }}>
              {error instanceof ApiError ? error.title : t('unknown-error', { ns: 'common' })}
            </Text>
          </View>
        )}

        {crew && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: bottom + 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {/* Hero card */}
            <View style={pv.card}>
              <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <View style={{ position: 'relative' }}>
                  <View style={pv.avatar}>
                    {photoUrl ? (
                      <Image source={{ uri: photoUrl }} style={pv.avatarImg} />
                    ) : (
                      <Text style={pv.avatarInitials}>{initials}</Text>
                    )}
                  </View>
                  {photoCount > 0 && (
                    <View style={pv.photoBadge}>
                      <Text style={pv.photoBadgeText}>{photoCount}</Text>
                    </View>
                  )}
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={pv.heroRole} numberOfLines={2}>
                    {crew.mainPosition || '—'}
                  </Text>
                  <Text style={pv.heroName}>
                    {crew.name} {crew.surname}
                  </Text>
                  <Text style={pv.heroMeta} numberOfLines={3}>
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
              <View style={pv.pillsRow}>
                {hasSeamansBook && (
                  <View style={[pv.pill, pv.pillGreen]}>
                    <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
                    <Text style={[pv.pillText, { color: GREEN_TEXT }]}>{t('seaman-book', { ns: 'crew-screen' })}</Text>
                  </View>
                )}
                {hasCertificateOfCompetence ? (
                  <View style={[pv.pill, pv.pillGreen]}>
                    <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
                    <Text style={[pv.pillText, { color: GREEN_TEXT }]}>{t('coc-valid', { ns: 'crew-screen' })}</Text>
                  </View>
                ) : (
                  <View style={[pv.pill, pv.pillWarn]}>
                    <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
                    <Text style={[pv.pillText, { color: WARN_TEXT }]}>{t('no-coc', { ns: 'crew-screen' })}</Text>
                  </View>
                )}
                {coursesList.length > 0 ? (
                  <View style={[pv.pill, pv.pillNeutral]}>
                    <Text style={[pv.pillText, { color: C.ink2 }]}>
                      {t('courses-count', { ns: 'crew-screen', count: coursesList.length })}
                    </Text>
                  </View>
                ) : (
                  <View style={[pv.pill, pv.pillWarn]}>
                    <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
                    <Text style={[pv.pillText, { color: WARN_TEXT }]}>
                      {t('no-courses-short', { ns: 'crew-screen' })}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Quad facts grid */}
            <View style={pv.quadGrid}>
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
                    pv.quadCell,
                    i % 2 === 0 && { borderRightWidth: 1, borderRightColor: C.hair2 },
                    i < 2 && { borderBottomWidth: 1, borderBottomColor: C.hair2 },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Icon size={13} color={C.ink4} strokeWidth={1.8} />
                    <Text style={pv.quadLabel}>{label}</Text>
                  </View>
                  <Text style={pv.quadValue}>{value || '—'}</Text>
                </View>
              ))}
            </View>

            {/* Roles & positions */}
            <SectionCard title={t('roles-and-positions', { ns: 'crew-screen' })}>
              <FieldRow label={t('main-position', { ns: 'offer' })} value={crew.mainPosition} bold />
              {crew.specseling ? (
                <FieldRow label={t('position-specialty', { ns: 'offer' })} value={crew.specseling} />
              ) : null}
              {otherPositions.length > 0 && (
                <>
                  <Text style={pv.fieldLabel}>{t('other-roles', { ns: 'crew-screen' })}</Text>
                  <View style={pv.tagsRow}>
                    {otherPositions.map((p) => (
                      <View key={p} style={[pv.pill, pv.pillNeutral]}>
                        <Text style={[pv.pillText, { color: C.ink2 }]}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </SectionCard>

            {/* Languages & education */}
            {(languages.length > 0 || !!crew.educationalLevel || coursesList.length > 0) && (
              <SectionCard title={t('languages-and-education', { ns: 'crew-screen' })}>
                {languages.length > 0 && (
                  <>
                    <Text style={pv.fieldLabel}>{t('languages', { ns: 'crew' })}</Text>
                    <View style={pv.tagsRow}>
                      {languages.map((l, i) => (
                        <View key={`${l}-${i}`} style={[pv.pill, pv.pillNeutral]}>
                          <Text style={[pv.pillText, { color: C.ink2 }]}>{l}</Text>
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
                    <Text style={pv.fieldLabel}>{t('corses-and-certificates', { ns: 'crew-screen' })}</Text>
                    <View style={pv.tagsRow}>
                      {coursesList.map((c, i) => (
                        <View key={`${c}-${i}`} style={pv.pillOrange}>
                          <Text style={[pv.pillText, { color: ORANGE_TEXT }]}>{c}</Text>
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
                <View style={pv.emptyState}>
                  <Info size={14} color={C.ink3} strokeWidth={1.8} />
                  <Text style={pv.emptyStateText}>{t('no-experience', { ns: 'crew' })}</Text>
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
            {(crew.relationalSkills ||
              crew.organizationalSkills ||
              crew.technicalSkills ||
              crew.professionalSkills) && (
              <SectionCard title={t('skills-and-abilities', { ns: 'crew-screen' })}>
                {[
                  { label: t('soft-skills', { ns: 'crew' }), value: crew.relationalSkills },
                  { label: t('organizational-skills', { ns: 'crew' }), value: crew.organizationalSkills },
                  { label: t('technical-skills', { ns: 'crew' }), value: crew.technicalSkills },
                  { label: t('further-abilities', { ns: 'crew' }), value: crew.professionalSkills },
                ]
                  .filter(({ value }) => !!value)
                  .map(({ label, value }) => (
                    <View key={label} style={{ marginBottom: 12 }}>
                      <Text style={pv.fieldLabel}>{label}</Text>
                      <Text style={pv.fieldValue}>{value}</Text>
                    </View>
                  ))}
              </SectionCard>
            )}

            {/* About */}
            {crew.curriculum ? (
              <SectionCard title={t('about', { ns: 'crew' })}>
                <HtmlText style={pv.aboutText}>{`“${crew.curriculum}”`}</HtmlText>
              </SectionCard>
            ) : null}

            {/* References */}
            <SectionCard title={t('references', { ns: 'crew' })}>
              {!crew.approvedReferences?.length ? (
                <View style={pv.emptyState}>
                  <Info size={14} color={C.ink3} strokeWidth={1.8} />
                  <Text style={pv.emptyStateText}>{t('no-references', { ns: 'crew-screen' })}</Text>
                </View>
              ) : (
                crew.approvedReferences.map((ref, i) => <ReferenceItem key={ref.idReference} ref={ref} index={i} />)
              )}
            </SectionCard>

            {/* Contact information */}
            <SectionCard title={t('contact-information', { ns: 'crew' })}>
              {[
                { label: t('email', { ns: 'crew' }), value: crew.email || crew.emailCc },
                { label: t('phone', { ns: 'crew' }), value: crew.telephone },
                { label: t('cellular', { ns: 'crew' }), value: crew.cellular },
                { label: t('whatsapp', { ns: 'crew' }), value: crew.callWhatsapp },
              ]
                .filter(({ value }) => !!value)
                .map(({ label, value }) => (
                  <View key={label} style={pv.contactRow}>
                    <Text style={pv.contactLabel}>{label}</Text>
                    <Text style={pv.contactValue}>{value}</Text>
                  </View>
                ))}
            </SectionCard>
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}

const pv = StyleSheet.create({
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
  refRowBorder: { borderTopWidth: 1, borderTopColor: C.hair2 },
  refRole: { fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2 },
  refMeta: { fontSize: 12, color: C.ink3 },
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
})

export default PublicPreviewModal

PublicPreviewModal.displayName = 'PublicPreviewModal'
