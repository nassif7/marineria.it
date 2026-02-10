import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProUserOffers } from '@/api'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { ScrollView } from 'react-native'
import { Box, VStack, HStack, Heading, Text, Divider } from '@/components/ui'
import { ChevronDown } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select'

import OfferListItem from './OfferListItem'

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

  console.log(data?.filter((item, index) => [1, 2].includes(index)))

  // return (
  //   <>
  //     {isLoading && <Loading />}
  //     {!isLoading && data && (
  //       <>
  //         <Box className=" p-4">
  //           <Heading size="2xl" className="text-white">
  //             {t('jobList')} ({data.length}):
  //           </Heading>
  //         </Box>
  //         <FlatList
  //           data={data}
  //           renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
  //           ListEmptyComponent={<ListEmptyComponent message={t('noProUserJobOffers')} />}
  //           ListHeaderComponent={() => <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />}
  //         />
  //       </>
  //     )}
  //   </>
  // )

  const offers = data || []
  const [filter, setFilter] = useState('all')

  const handleViewOffer = (offerId: number) => {
    console.log('clicked')
  }

  return (
    <VStack className="gap-4 p-3 flex-1">
      {/* Header */}
      <Box className="bg-white rounded-2xl p-5 shadow-sm">
        <VStack className="gap-3">
          <HStack className="items-center justify-between">
            <VStack className="gap-1">
              <Text className="text-primary-500 text-sm font-medium uppercase tracking-wide">Job offers</Text>
              <Heading size="2xl" className="text-typography-900">
                Current Job List ({offers.length})
              </Heading>
            </VStack>
          </HStack>

          {/* Filter */}
          <Box>
            <Select selectedValue={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full">
                <SelectInput placeholder="All job offers" />
                <SelectIcon as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectItem label="All job offers" value="all" />
                  <SelectItem label="New offers" value="new" />
                  <SelectItem label="Applied" value="applied" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
        </VStack>
      </Box>
      <FlatList
        ItemSeparatorComponent={() => <Divider className="my-2 bg-transparent" />}
        data={data}
        renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
        // ListEmptyComponent={<ListEmptyComponent message={t('noProUserJobOffers')} />}
        // ListHeaderComponent={() => <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />}
      />
    </VStack>
  )
}

export default JobOfferList
