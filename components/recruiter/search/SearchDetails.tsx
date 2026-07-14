import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Stack } from 'expo-router'
import { Anchor, Sparkles, MapPin, ChevronLeft, ChevronRight, Edit, Headphones } from 'lucide-react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { consumeFromHome } from '@/utils/fromHomeNav'
import { useAuthBrowser } from '@/hooks'
import { useTranslation } from 'react-i18next'
import { useRecruiterSearch } from '@/Providers/RecruiterSearchProvider'
import { Loading } from '@/components/ui'
import { ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import HtmlText from '@/components/pro/HtmlText'
import { supportTeam } from '@/api'
import ContactSupport from '@/components/common/ContactSupport'

const isVal = (s?: string | null): s is string => !!s && s.trim() !== '' && s.trim().toUpperCase() !== 'NA'

export default function SearchDetails() {
  const [cameFromHome] = useState(consumeFromHome)
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen', 'offer'])
  const { openUrl, isLoading: isUrlLoading } = useAuthBrowser()
  const { bottom: bottomInset } = useSafeAreaInsets()
  const {
    search: { data: search, isLoading, isRefetching, isError, isSuccess },
  } = useRecruiterSearch()

  if (isLoading || isRefetching) return <Loading />
  if (isError) return <ErrorMessage />
  if (!isSuccess || !search) return null

  const salary =
    search.salary_From && search.salary_To
      ? search.salary_From === search.salary_To
        ? search.salary_From
        : `${search.salary_From} – ${search.salary_To}`
      : null

  const selected = Math.max(0, search.countCandidates - search.countContacted)
  const hasCoords = search.latArm !== 0 && search.lngArm !== 0
  const hasLocation = isVal(search.positionArm) || hasCoords

  const referenceShort = search.reference?.includes('_') ? search.reference.split('_')[1] : search.reference

  const handleEdit = () => openUrl(`https://www.marineria.it/${language}/rec/Post.aspx?idofferta=${search.idoffer}`)

  const viewCrewList = (filter?: 'all' | 'selected' | 'contacted' | 'residual') =>
    router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list${filter ? `?filter=${filter}` : ''}`)

  const openBySkill = () => openUrl(`https://www.marineria.it/${language}/${search.listurl}`)
  const openByLocation = () => openUrl(`https://www.marineria.it/${language}/${search.listgeourl}`)
  const openMap = () =>
    hasCoords && Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${search.latArm},${search.lngArm}`)

  const additionalPills = [
    isVal(search.seamensBook) && t('seamans-book-label', { value: search.seamensBook }),
    isVal(search.gender) && t('gender-label', { value: search.gender }),
    isVal(search.courses) && t('courses-label', { value: search.courses }),
    isVal(search.positionSpecial) && t('position-specialty-label', { value: search.positionSpecial }),
  ].filter(Boolean) as string[]

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Sticky header ── */}
      <View style={sd.stickyHeader}>
        <View style={sd.navRow}>
          <Pressable
            style={sd.iconBtn}
            onPress={() => (cameFromHome ? router.navigate('/(tabs)' as any) : router.back())}
          >
            <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
          </Pressable>
          <Text style={sd.navRef} pointerEvents="none">
            Ref · {referenceShort}
          </Text>
          <View style={sd.navRightGroup}>
            <TouchableOpacity style={sd.editBtn} onPress={handleEdit} disabled={isUrlLoading}>
              <Edit size={14} color="#FFF" strokeWidth={2} />
              <Text style={sd.editBtnText}>{t('modify', { ns: 'offer' })}</Text>
            </TouchableOpacity>
            <ContactSupport
              title={t('contact-support', { ns: 'settings-screen' })}
              supportTeam={supportTeam}
              renderTrigger={({ onPress }) => (
                <Pressable style={sd.iconBtn} onPress={onPress}>
                  <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
                </Pressable>
              )}
            />
          </View>
        </View>
        <Text style={sd.headerTitle}>{search.offer?.trim() || '—'}</Text>
        <Text style={sd.heroMeta}>{t('ref-published-date', { ref: referenceShort, date: search.offerdate })}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={sd.scrollContent}>
        {/* ── Contract & period ── */}
        <View style={sd.card}>
          <SectionLabel>{t('contract-period')}</SectionLabel>
          <View style={sd.factGrid}>
            {salary && <FactCell label={t('salary-per-month', { ns: 'offer' })} value={salary} />}
            {isVal(search.contractDescription) && (
              <FactCell label={t('contract-type-label')} value={search.contractDescription} />
            )}
            {isVal(search.boarding) && (
              <FactCell label={t('boarding', { ns: 'offer' })} value={search.boarding.trim()} />
            )}
            {isVal(search.duration) && <FactCell label={t('period', { ns: 'offer' })} value={search.duration.trim()} />}
          </View>

          {hasLocation && (
            <View style={sd.locationRow}>
              <MapPin size={14} color={C.ink4} strokeWidth={1.8} />
              {hasCoords ? (
                <Pressable onPress={openMap}>
                  <Text style={sd.locationLink}>{search.positionArm || t('view-on-map')}</Text>
                </Pressable>
              ) : (
                <Text style={sd.locationText}>{search.positionArm}</Text>
              )}
            </View>
          )}
        </View>

        {/* ── Position & Requirements ── */}
        <View style={sd.card}>
          <SectionLabel>{t('position-requirements', { ns: 'offer' })}</SectionLabel>

          {isVal(search.mainPosition) && (
            <View style={sd.roleChip}>
              <Anchor size={14} color={C.ink2} strokeWidth={1.8} />
              <Text style={sd.roleChipText}>{search.mainPosition}</Text>
            </View>
          )}

          {isVal(search.requirements) && (
            <>
              <SectionLabel top>{t('requirements', { ns: 'offer' })}</SectionLabel>
              <Text style={sd.bodyText}>{search.requirements}</Text>
            </>
          )}

          {isVal(search.descriptionOffer) && (
            <>
              <SectionLabel top>{t('description', { ns: 'offer' })}</SectionLabel>
              <HtmlText style={sd.bodyText}>{search.descriptionOffer}</HtmlText>
            </>
          )}

          {additionalPills.length > 0 && (
            <>
              <SectionLabel top>{t('additional-info', { ns: 'offer' })}</SectionLabel>
              <View style={sd.pillsRow}>
                {additionalPills.map((p) => (
                  <InfoPill key={p}>{p}</InfoPill>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── Candidates ── */}
        <View style={sd.card}>
          <View style={sd.candidatesHeader}>
            <SectionLabel>{t('candidates')}</SectionLabel>
            <Pressable onPress={() => viewCrewList()}>
              <Text style={sd.viewAllText}>{t('view-all')}</Text>
            </Pressable>
          </View>

          <View style={sd.funnel}>
            <FunnelStage
              n={selected}
              label={t('selected')}
              color={selected > 0 ? C.orangeText : C.ink4}
              labelColor={selected > 0 ? C.orangeText : C.ink4}
              onPress={() => viewCrewList('selected')}
            />
            <FunnelArrow />
            <FunnelStage
              n={search.countContacted}
              label={t('contacted')}
              color={search.countContacted > 0 ? C.green : C.ink4}
              labelColor={search.countContacted > 0 ? C.green : C.ink4}
              onPress={() => viewCrewList('contacted')}
            />
            <FunnelArrow />
            <FunnelStage
              n={search.countResidual}
              label={t('residual')}
              color={C.ink4}
              labelColor={C.ink4}
              onPress={() => viewCrewList('residual')}
            />
          </View>

          <View style={sd.findCrewSection}>
            <Text style={sd.findCrewLabel}>{t('find-new-candidates')}</Text>
            <View style={sd.findCrewRow}>
              <TouchableOpacity style={sd.findBtn} onPress={openBySkill} disabled={isUrlLoading}>
                <Sparkles size={14} color={C.green} strokeWidth={2} />
                <Text style={sd.findBtnText}>{t('by-skill')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={sd.findBtn} onPress={openByLocation} disabled={isUrlLoading}>
                <MapPin size={14} color={C.green} strokeWidth={2} />
                <Text style={sd.findBtnText}>{t('by-location')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={[sd.bottomBar, { paddingBottom: Math.max(12, bottomInset) }]}>
        <TouchableOpacity style={sd.viewCandidatesBtn} onPress={() => viewCrewList()}>
          <Text style={sd.viewCandidatesBtnText}>{t('view-candidates-count', { count: search.countCandidates })}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ── Sub-components ───────────────────────────────────────────

function SectionLabel({ children, top = false }: { children: string; top?: boolean }) {
  return <Text style={[sd.sectionLabel, top && { marginTop: 18 }]}>{children}</Text>
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={sd.factCell}>
      <Text style={sd.factLabel}>{label}</Text>
      <Text style={sd.factValue}>{value}</Text>
    </View>
  )
}

function InfoPill({ children }: { children: string }) {
  return (
    <View style={sd.infoPill}>
      <Text style={sd.infoPillText}>{children}</Text>
    </View>
  )
}

function FunnelStage({
  n,
  label,
  color,
  labelColor,
  onPress,
}: {
  n: number
  label: string
  color: string
  labelColor: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={sd.funnelStage} onPress={onPress} activeOpacity={0.7}>
      <Text style={[sd.funnelNum, { color }]}>{Math.max(0, n)}</Text>
      <Text style={[sd.funnelLabel, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  )
}

function FunnelArrow() {
  return (
    <View style={{ opacity: 0.35, flexShrink: 0 }}>
      <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
    </View>
  )
}

// ── Styles ───────────────────────────────────────────────────

const sd = StyleSheet.create({
  scrollContent: { paddingTop: 16, paddingBottom: 24 },

  stickyHeader: {
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    position: 'relative',
  },
  navRightGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRef: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: C.orange,
  },
  editBtnText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.ink, letterSpacing: -0.4, lineHeight: 28, marginBottom: 4 },
  heroMeta: { fontSize: 12, color: C.ink4 },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  factGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, columnGap: 16 },
  factCell: { width: '45%' },
  factLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  factValue: { fontSize: 14, fontWeight: '600', color: C.ink, lineHeight: 19 },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  locationText: { fontSize: 14, fontWeight: '600', color: C.ink },
  locationLink: { fontSize: 14, fontWeight: '600', color: C.green, textDecorationLine: 'underline' },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.ink3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: C.field,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  roleChipText: { fontSize: 14, fontWeight: '700', color: C.ink },

  bodyText: { fontSize: 14, lineHeight: 22, color: C.ink2, marginBottom: 4 },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  infoPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: C.hair },
  infoPillText: { fontSize: 12, fontWeight: '600', color: C.ink2 },

  candidatesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  viewAllText: { fontSize: 12, fontWeight: '600', color: C.green, marginBottom: 10 },
  funnel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: C.field,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  funnelStage: { flex: 1, alignItems: 'center' },
  funnelNum: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, lineHeight: 30 },
  funnelLabel: { fontSize: 11, fontWeight: '600', marginTop: 5, letterSpacing: 0.2, textTransform: 'uppercase' },

  findCrewSection: { paddingTop: 14, borderTopWidth: 1, borderTopColor: C.hair2 },
  findCrewLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: C.ink3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  findCrewRow: { flexDirection: 'row', gap: 8 },
  findBtn: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.green,
    backgroundColor: '#E8F8EB',
  },
  findBtnText: { fontSize: 13, fontWeight: '700', color: '#0F7A28' },

  bottomBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  viewCandidatesBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCandidatesBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF', letterSpacing: 0.2 },
})
