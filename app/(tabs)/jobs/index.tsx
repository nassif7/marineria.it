import { router } from 'expo-router'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getPublicOffers } from '@/api'
import { Loading, Box, HStack, Text } from '@/components/ui'
import { ErrorMessage, List, EmptyList, ScreenContainer, NavBar } from '@/components/appUI'
import OfferListItem from '@/components/pro/offers/offerList/OfferListItem'
import { TOffer } from '@/api/types'

const RightAction = ({ itemsCount, isLoading }: { itemsCount: number; isLoading: boolean }) => {
  if (isLoading) return null
  return (
    <HStack className="pr-3 items-center">
      <Box className="bg-success-500 rounded-full px-2 py-0.5 items-center justify-center">
        <Text color="white" bold size="sm">
          {itemsCount}
        </Text>
      </Box>
    </HStack>
  )
}

const JobsScreen = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'screens-labels'])

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['public-offers'],
    queryFn: () => getPublicOffers(language),
  })

  const handleViewOffer = (offer: TOffer) => {
    router.push(`/(tabs)/jobs/${offer.idoffer}`)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('offers'),
          contentStyle: { backgroundColor: 'white' },
          header: (props) => (
            <NavBar
              {...props}
              rightAction={<RightAction itemsCount={data?.length ?? 0} isLoading={isLoading || isRefetching} />}
            />
          ),
        }}
      />
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
    </>
  )
}

export default JobsScreen
