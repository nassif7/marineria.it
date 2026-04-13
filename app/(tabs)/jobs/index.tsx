import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getPublicOffers } from '@/api'
import { Loading } from '@/components/ui'
import { ErrorMessage, List, EmptyList, ScreenContainer } from '@/components/appUI'
import OfferListItem from '@/components/pro/offers/offerList/OfferListItem'
import { TOffer } from '@/api/types'

const JobsScreen = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation('offer-screen')

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['public-offers'],
    queryFn: () => getPublicOffers(language),
  })

  const handleViewOffer = (offer: TOffer) => {
    router.push(`/(tabs)/jobs/${offer.idoffer}`)
  }

  return (
    <ScreenContainer>
      {(isLoading || isRefetching) && <Loading />}
      {isSuccess && (
        <List
          data={data}
          isRefetching={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <OfferListItem offer={item} hideStatus key={item.reference} onViewOffer={() => handleViewOffer(item)} />
          )}
          listEmptyComponent={<EmptyList message={t('no-offers')} />}
        />
      )}
      {isError && <ErrorMessage />}
    </ScreenContainer>
  )
}

export default JobsScreen
