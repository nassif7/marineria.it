import { FC, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getProOffers } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Text, Loading, HStack, Box } from '@/components/ui'
import { List, ScreenContainer, NavBar } from '@/components/appUI'
import OfferListItem from './OfferListItem'

const RightAction = ({
  itemsCount,
  isLoading,
  onAction,
}: {
  itemsCount: number
  isLoading: boolean
  onAction?: () => void
}) => {
  return (
    <HStack className="pr-3 items-center" space="xs">
      <Box className="bg-success-500 rounded-md w-6 h-6 items-center justify-center shrink-0">
        {isLoading && <ActivityIndicator size={4} color="white" />}
        {!isLoading && (
          <Text color="white" bold size="sm">
            {itemsCount}
          </Text>
        )}
      </Box>
      {/* <Icon as={ListFilter} size="2xl" className="text-typography-400 font-bold" /> */}
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
              rightAction={<RightAction itemsCount={data?.length || 0} isLoading={isLoading || isRefetching} />}
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
          />
        )}
        {isError && <Text color="error">{t('error')}</Text>}
      </ScreenContainer>
    </>
  )
}

export default JobOfferList
