import { FC, useCallback, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { Stack, useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getAllOffersPost, getOffersForApplyPost } from '@/api'
import { useCrew } from '@/Providers/CrewProvider'
import { useSavedOffers, useManualRefresh } from '@/hooks'
import { Loading, RefreshControl } from '@/components/ui'
import { ErrorMessage, EmptyList } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import OfferListItem from './OfferListItem'

type FilterKey = 'all' | 'matching' | 'applied' | 'saved'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'screens-labels'])

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t('filter-all', { ns: 'offer-screen' }) },
    { key: 'matching', label: t('filter-matching', { ns: 'offer-screen' }) },
    { key: 'applied', label: t('filter-applied', { ns: 'offer-screen' }) },
    { key: 'saved', label: t('filter-saved', { ns: 'offer-screen' }) },
  ]
  const { token } = useCrew()
  const [filter, setFilter] = useState<FilterKey>('matching')
  const { savedIds } = useSavedOffers()

  // const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
  //   queryKey: ['offers', ownOffers],
  //   queryFn: () => getProOffers(token, ownOffers == 'all', language),
  // })

  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll,
    data: allOffersData,
  } = useQuery({
    queryKey: ['offers-all', token, language],
    queryFn: () => getAllOffersPost(token, language),
  })

  const {
    isLoading: isLoadingMatching,
    isError: isErrorMatching,
    refetch: refetchMatching,
    data: matchingOffersData,
  } = useQuery({
    queryKey: ['offers-matching', token, language],
    queryFn: () => getOffersForApplyPost(token, language),
  })

  const isLoading = isLoadingAll || isLoadingMatching
  const isError = isErrorAll || isErrorMatching
  const refetch = () => Promise.all([refetchAll(), refetchMatching()])
  const { refreshing, onRefresh } = useManualRefresh(refetch)

  // Refetch every time this screen gains focus (not just on first mount) so the list
  // is never stale after applying/saving elsewhere and navigating back to it.
  useFocusEffect(
    useCallback(() => {
      refetchAll()
      refetchMatching()
    }, [refetchAll, refetchMatching])
  )

  const allOffers = allOffersData ?? []
  const matchingOffers = (matchingOffersData ?? []).filter((o) => !o.alreadyApplied)
  const savedOffers = allOffers.filter((o) => savedIds.includes(String(o.idoffer)))
  const appliedOffers = allOffers.filter((o) => o.alreadyApplied)
  const data =
    filter === 'all'
      ? allOffers
      : filter === 'matching'
        ? matchingOffers
        : filter === 'applied'
          ? appliedOffers
          : savedOffers

  const counts: Record<FilterKey, number> = {
    all: allOffers.length,
    matching: matchingOffers.length,
    applied: appliedOffers.length,
    saved: savedOffers.length,
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {isLoading && <Loading />}
      {!isLoading && isError && <ErrorMessage />}

      {!isLoading && !isError && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={ls.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* In-content header */}
          <View style={ls.header}>
            <View>
              <Text style={ls.headerTitle}>{t('offer-list', { ns: 'screens-labels' })}</Text>
            </View>
          </View>

          {/* Filter chips */}
          {/* "saved" filter hidden until the API supports it — kept in FILTERS/counts/data above, just not rendered */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ls.filtersRow}>
            {FILTERS.filter((f) => f.key !== 'saved').map((f) => {
              const isActive = filter === f.key
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  style={[ls.chip, isActive ? ls.chipActive : ls.chipInactive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text style={[ls.chipLabel, isActive ? ls.chipLabelActive : ls.chipLabelInactive]}>{f.label}</Text>
                  <View style={[ls.chipCount, isActive ? ls.chipCountActive : ls.chipCountInactive]}>
                    <Text style={[ls.chipCountText, isActive ? ls.chipCountTextActive : ls.chipCountTextInactive]}>
                      {counts[f.key]}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>

          {/* Card list */}
          <View style={ls.list}>
            {data.length === 0 ? (
              <EmptyList
                message={t(
                  filter === 'saved' ? 'no-saved-offers' : filter === 'applied' ? 'no-applied-offers' : 'no-offers',
                  { ns: 'offer-screen' }
                )}
              />
            ) : (
              data.map((offer) => <OfferListItem key={offer.reference} offer={offer} />)
            )}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const ls = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
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
  chipCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  chipCountActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  chipCountInactive: {
    backgroundColor: C.hair2,
  },
  chipCountText: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.75,
  },
  chipCountTextActive: {
    color: '#FFFFFF',
  },
  chipCountTextInactive: {
    color: C.ink3,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
})

export default JobOfferList
