import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, SafeAreaView, VirtualizedList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOffers, getProUserOffers } from '@/api'
import { JobOfferTypes, AuthTypes } from '@/api/types'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { HStack, Loading, ListEmptyComponent, Divider, VStack, Text } from '@/components/ui'
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
  }, [language, ownOffers, state])

  const { isLoading, data } = useFetch(fetchOffers)

  const onChange = (v: string) => setOwnOffers(v)

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <VirtualizedList
          data={data}
          getItemCount={(data: JobOfferTypes.JobOfferType[]) => data?.length}
          getItem={(data: JobOfferTypes.JobOfferType[], index) => data[index]}
          keyExtractor={(item) => item.reference}
          renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
          initialNumToRender={4}
          ListEmptyComponent={
            <ListEmptyComponent
              message={t(role === AuthTypes.UserRole.PRO ? 'noProUserJobOffers' : 'noOwnerJobOffers')}
            />
          }
          refreshing={!!data?.length}
          ItemSeparatorComponent={() => <Divider className=" bg-secondary-800 h-4" />}
          ListHeaderComponent={
            role === AuthTypes.UserRole.PRO
              ? () => (
                  <HStack className="mb-2  p-3 items-center bg-white rounded">
                    <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />
                  </HStack>
                )
              : null
          }
          stickyHeaderIndices={[0]}
        />
      )}
    </>
  )
}

export default JobOfferList
