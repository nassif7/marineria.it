import { FC, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react-native'
import { consumeFromHome } from '@/utils/fromHomeNav'
// import { getCrewList } from '@/api'
import { getCrewListPost } from '@/api'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { useRecruiterSearch } from '@/Providers/RecruiterSearchProvider'
import { Loading, RefreshControl } from '@/components/ui'
import { ErrorMessage, EmptyList } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import { useManualRefresh } from '@/hooks'
import CrewListItem from './CrewListItem'

type FilterKey = 'all' | 'to-contact' | 'contacted'

const mapUrlFilter = (f?: string): FilterKey => {
  if (f === 'contacted') return 'contacted'
  if (f === 'selected') return 'to-contact'
  return 'all'
}

const CrewList: FC = () => {
  const [cameFromHome] = useState(consumeFromHome)
  const {
    t,
    i18n: { language },
  } = useTranslation(['crew-screen', 'screens-labels'])

  const router = useRouter()
  const { searchId, filter: filterParam } = useLocalSearchParams<{ searchId: string; filter?: string }>()
  const { token } = useRecruiter()
  const {
    search: { data: search },
  } = useRecruiterSearch()

  const [activeFilter, setActiveFilter] = useState<FilterKey>(mapUrlFilter(filterParam))

  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ['recruiter-crew-list-post', searchId, language],
    queryFn: () => getCrewListPost(searchId as string, token, language),
  })
  const { refreshing, onRefresh } = useManualRefresh(refetch)

  const allCrew = data ?? []
  const referenceShort = search?.reference?.includes('_') ? search.reference.split('_')[1] : search?.reference
  const residual = search?.countResidual ?? Math.max(0, 30 - allCrew.length)

  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: t('filter-all'), count: allCrew.length },
    { key: 'to-contact', label: t('filter-to-contact'), count: allCrew.filter((c) => !c.contacted).length },
    { key: 'contacted', label: t('filter-contacted'), count: allCrew.filter((c) => !!c.contacted).length },
  ]

  const filtered = (() => {
    if (activeFilter === 'to-contact') return allCrew.filter((c) => !c.contacted)
    if (activeFilter === 'contacted') return allCrew.filter((c) => !!c.contacted)
    return allCrew
  })()

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Nav bar ── */}
      <View style={cl.navRow}>
        <Pressable
          style={cl.iconBtn}
          onPress={() => (cameFromHome ? router.navigate('/(tabs)' as any) : router.back())}
        >
          <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
        </Pressable>
        <Text style={cl.navRef}>{referenceShort ? `Ref · ${referenceShort}` : ''}</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading && <Loading />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={cl.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Header: count + title */}
          <View style={cl.header}>
            <View style={cl.headerTitleRow}>
              <Text style={cl.headerTitle}>{t('crew-list', { ns: 'screens-labels' })}</Text>
              <View style={cl.residualBadge}>
                <Text style={cl.residualBadgeText}>{t('filter-residual')} </Text>
                <Text style={[cl.residualBadgeText, { fontWeight: '700' }]}>{residual}</Text>
              </View>
            </View>
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={cl.filtersRow}>
            {tabs.map((tab, i) => {
              const active = activeFilter === tab.key
              return (
                <Pressable
                  key={tab.key}
                  style={[cl.chip, active ? cl.chipActive : cl.chipInactive, { marginRight: 8 }]}
                  onPress={() => setActiveFilter(tab.key)}
                >
                  <Text style={[cl.chipLabel, active ? cl.chipLabelActive : cl.chipLabelInactive]}>{tab.label}</Text>
                  <View style={[cl.chipCount, active ? cl.chipCountActive : cl.chipCountInactive]}>
                    <Text style={[cl.chipCountText, active ? cl.chipCountTextActive : cl.chipCountTextInactive]}>
                      {tab.count}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>

          {/* Cards */}
          <View style={cl.list}>
            {filtered.length === 0 ? (
              <EmptyList message={t('empty-crew-list')} />
            ) : (
              filtered.map((c) => <CrewListItem key={c.userId} crew={c} />)
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const cl = StyleSheet.create({
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
  navRef: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    paddingBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chipActive: { backgroundColor: C.ink },
  chipInactive: { backgroundColor: C.card, borderWidth: 1, borderColor: C.hair },
  chipLabel: { fontSize: 13, fontWeight: '600', marginRight: 6 },
  chipLabelActive: { color: '#FFF' },
  chipLabelInactive: { color: C.ink2 },
  chipCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 20,
    alignItems: 'center',
  },
  chipCountActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  chipCountInactive: { backgroundColor: C.hair2 },
  chipCountText: { fontSize: 11, fontWeight: '600' },
  chipCountTextActive: { color: '#FFF' },
  chipCountTextInactive: { color: C.ink3 },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  residualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#F4A27A',
  },
  residualBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#C85E2A',
  },
})

export default CrewList
