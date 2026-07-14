import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { router, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getPublicOffers } from '@/api'
import { TOffer } from '@/api/types'
import { Loading, RefreshControl } from '@/components/ui'
import { ErrorMessage, EmptyList } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import { useManualRefresh } from '@/hooks'
import OfferListItem from '@/components/pro/offers/offerList/OfferListItem'

const JobsScreen = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'screens-labels'])

  const { isLoading, isError, refetch, data } = useQuery({
    queryKey: ['public-offers', language],
    queryFn: () => getPublicOffers(language),
  })
  const { refreshing, onRefresh } = useManualRefresh(refetch)
  const offers = data ?? []

  const handleViewOffer = (offer: TOffer) => {
    router.push(`/(tabs)/jobs/${offer.idoffer}`)
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
          <View style={ls.header}>
            <Text style={ls.headerTitle}>{t('offer-list', { ns: 'screens-labels' })}</Text>
          </View>

          <View style={ls.list}>
            {offers.length === 0 ? (
              <EmptyList message={t('no-offers', { ns: 'offer-screen' })} />
            ) : (
              offers.map((offer) => (
                <OfferListItem
                  key={offer.reference}
                  offer={offer}
                  hideStatus
                  onViewOffer={() => handleViewOffer(offer)}
                />
              ))
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
})

export default JobsScreen
