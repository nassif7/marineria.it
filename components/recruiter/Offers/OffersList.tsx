import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOffers } from '@/api'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading, ListEmptyComponent, Box, Heading } from '@/components/ui'
import JobOfferListItem from './JobOfferListItem'

const OffersList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const fetchOffers = useCallback(async () => {
    return await getOwnerOffers(token, language)
  }, [language, state])
  const { isLoading, data } = useFetch(fetchOffers)

  console.log('Recruiter offers layout...')
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
            ListEmptyComponent={<ListEmptyComponent message={t('noOwnerJobOffers')} />}
            stickyHeaderIndices={[0]}
          />
        </>
      )}
    </>
  )
}

export default OffersList
