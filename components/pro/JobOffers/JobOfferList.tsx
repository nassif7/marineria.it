import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProUserOffers } from '@/api'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading, ListEmptyComponent, Box, Heading } from '@/components/ui'
import JobOfferListItem from './JobOfferListItem'
import JobOffersListHeader from './JobOffersListHeader'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')
  const fetchOffers = useCallback(async () => {
    return await getProUserOffers(token, ownOffers == 'all', language)
  }, [language, ownOffers, state])
  const { isLoading, data } = useFetch(fetchOffers)

  const onChange = (v: string) => setOwnOffers(v)

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <>
          <Box className=" p-4">
            <Heading size="2xl" className="text-white">
              {t('jobList')} ({data.length}):
            </Heading>
          </Box>
          <FlatList
            data={data}
            renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
            ListEmptyComponent={<ListEmptyComponent message={t('noProUserJobOffers')} />}
            ListHeaderComponent={() => <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />}
            stickyHeaderIndices={[0]}
          />
        </>
      )}
    </>
  )
}

export default JobOfferList
