import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, SafeAreaView, VirtualizedList, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOffers, getProUserOffers } from '@/api'
import { JobOfferTypes, AuthTypes } from '@/api/types'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { HStack, Loading, ListEmptyComponent, Divider, VStack, Text, Box, Heading } from '@/components/ui'
import JobOfferListItem from './JobOfferListItem'
import JobOffersListHeader from './JobOffersListHeader'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')
  const state = useAppState()

  const fetchOffers = useCallback(async () => {
    if (role == AuthTypes.UserRole.OWNER) {
      return await getOwnerOffers(token, language)
    } else {
      return await getProUserOffers(token, ownOffers == 'all', language)
    }
  }, [language, ownOffers, state, role])

  const { isLoading, data } = useFetch(fetchOffers)

  const onChange = (v: string) => setOwnOffers(v)

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <>
          <FlatList
            data={data}
            renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
            ListEmptyComponent={
              <ListEmptyComponent
                message={t(role === AuthTypes.UserRole.PRO ? 'noProUserJobOffers' : 'noOwnerJobOffers')}
              />
            }
            ListHeaderComponent={
              role === AuthTypes.UserRole.PRO
                ? () => <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />
                : null
            }
            stickyHeaderIndices={[0]}
          />
        </>
      )}
    </>
  )
}

export default JobOfferList
