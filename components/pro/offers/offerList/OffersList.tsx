import { FC, useState } from 'react'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getProOffers } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Text, Loading, HStack, Box } from '@/components/ui'
import { List, ScreenContainer, NavBar, ErrorMessage, EmptyList } from '@/components/appUI'
import OfferListItem from './OfferListItem'

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

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')
  const [showFilter, setShowFilter] = useState(false)

  const filterOptions = [
    { label: t('filter.all-offers'), value: 'all' },
    { label: t('filter.own-offers'), value: 'own' },
  ]

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offers', ownOffers],
    queryFn: () => getProOffers(token, ownOffers == 'all', language),
  })

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('offer-list', { ns: 'screens-labels' }),
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
            filter={{
              value: ownOffers,
              setValue: setOwnOffers,
              filterOptions,
            }}
            data={data}
            isRefetching={isRefetching}
            onRefresh={refetch}
            renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
            listEmptyComponent={<EmptyList message={t('offer-screen:no-offers')} />}
          />
        )}
        {isError && <ErrorMessage />}
      </ScreenContainer>
    </>
  )
}

export default JobOfferList
