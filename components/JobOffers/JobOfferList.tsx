import React, { FC, useCallback, useEffect, useState } from 'react'
import { JobOfferTypes } from '@/api/types'
import { HStack, Loading, ListEmptyComponent, Divider } from '@/components/ui'
import JobOfferListItem from './JobOfferListItem'
import { useTranslation } from 'react-i18next'
import { getOwnerOffers, getProUserOffers } from '@/api'
import { View, SafeAreaView, VirtualizedList } from 'react-native'
import { useAppState, useFetch } from '@/hooks'
import { useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'
import JobOffersListHeader from './JobOffersListHeader'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { activeProfile } = useUser()

  const { role, token } = activeProfile as any

  const [ownOffers, setOwnOffers] = useState<string>('all')
  const state = useAppState()

  const fetchOffers = useCallback(async () => {
    if (role == AuthTypes.UserRole.OWNER) {
      return await getOwnerOffers(language, ownOffers == 'own' && token)
    } else {
      return await getProUserOffers(token, language, ownOffers == 'all')
    }
  }, [language, ownOffers, state])

  const { isLoading, data } = useFetch(fetchOffers)

  const onChange = (v: string) => setOwnOffers(v)

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'rgb(30 41 59)',
      }}
    >
      {isLoading && <Loading />}
      {!isLoading && data && (
        <View className="h-full px-3">
          <VirtualizedList
            data={data}
            getItemCount={(data: JobOfferTypes.JobOfferType[]) => data?.length}
            getItem={(data: JobOfferTypes.JobOfferType[], index) => data[index]}
            keyExtractor={(item) => item.reference}
            renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
            initialNumToRender={4}
            ListEmptyComponent={<ListEmptyComponent message={t('noJobOffers')} />}
            refreshing={!!data?.length}
            ItemSeparatorComponent={() => <Divider className=" bg-secondary-800 h-4" />}
            ListHeaderComponent={() => (
              <HStack className="mb-2  p-3 items-center bg-white rounded">
                <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />
              </HStack>
            )}
            stickyHeaderIndices={[0]}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default JobOfferList
