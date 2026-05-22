import { FC } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getRecruiterActiveSearchesPost } from '@/api'
// import { getRecruiterActiveSearches } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading } from '@/components/ui'
import { EmptyList, ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import { useQuery } from '@tanstack/react-query'
import SearchListItem from './SearchListItem'

const FILTERS = [
  { key: 'active', label: 'Attive' },
  { key: 'paused', label: 'In pausa' },
  { key: 'closed', label: 'Chiuse' },
] as const

const RecruiterSearchList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen', 'screens-labels'])
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const { isLoading, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-search-list', token, language],
    // queryFn: () => getRecruiterActiveSearches(token, language),
    queryFn: () => getRecruiterActiveSearchesPost(token, language),
    enabled: state === 'active',
  })

  const searches = data ?? []

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {isLoading && <Loading />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={sl.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
          {/* In-content header */}
          <View style={sl.header}>
            <View>
              <Text style={sl.headerCount}>{searches.length} ricerche</Text>
              <Text style={sl.headerTitle}>{t('search-list', { ns: 'screens-labels' })}</Text>
            </View>
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sl.filtersRow}>
            {FILTERS.map((f, i) => {
              const isActive = i === 0
              return (
                <View key={f.key} style={[sl.chip, isActive ? sl.chipActive : sl.chipInactive]}>
                  <Text style={[sl.chipLabel, isActive ? sl.chipLabelActive : sl.chipLabelInactive]}>{f.label}</Text>
                </View>
              )
            })}
          </ScrollView>

          {/* Cards */}
          <View style={sl.list}>
            {searches.length === 0 ? (
              <EmptyList message={t('no-searches', { ns: 'search-screen' })} />
            ) : (
              searches.map((s) => <SearchListItem key={s.idoffer} search={s} />)
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const sl = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 4,
    paddingBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
  },
  chipActive: {
    backgroundColor: C.ink,
  },
  chipInactive: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.hair,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  chipLabelInactive: {
    color: C.ink2,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
})

RecruiterSearchList.displayName = 'RecruiterSearchList'

export default RecruiterSearchList
