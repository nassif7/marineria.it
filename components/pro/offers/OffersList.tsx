import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProOffers } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Text, Loading } from '@/components/ui'
import OfferListItem from './OfferListItem'
import { useQuery } from '@tanstack/react-query'
import { List, ScreenContainer } from '@/components/appUI'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offers-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')

  const filterOptions = [
    { label: t('filter.all-offers'), value: 'all' },
    { label: t('filter.own-offers'), value: 'own' },
  ]

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offers', ownOffers],
    queryFn: () => getProOffers(token, ownOffers == 'all', language),
  })

  return (
    <ScreenContainer>
      {(isLoading || isRefetching) && <Loading />}
      {isSuccess && (
        <List
          data={data}
          isRefetching={isRefetching}
          onRefresh={refetch}
          filter={{
            value: ownOffers,
            setValue: setOwnOffers,
            filterOptions,
          }}
          renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
        />
      )}
      {isError && <Text className="text-error-600 text-center">{t('error')}</Text>}
    </ScreenContainer>
  )
}

export default JobOfferList
