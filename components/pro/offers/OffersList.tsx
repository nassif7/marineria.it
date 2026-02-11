import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProOffers } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Box, VStack, HStack, Heading, Text, Divider, Loading } from '@/components/ui'
import { ChevronDown } from 'lucide-react-native'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import OfferListItem from './OfferListItem'
import { useQuery } from '@tanstack/react-query'

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()

  // const state = useAppState() this to fetch the offers when the app state change

  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')
  const onChange = (v: string) => setOwnOffers(v)

  const { isFetching, data, isSuccess } = useQuery({
    queryKey: ['offers', ownOffers],
    queryFn: () => getProOffers(token, ownOffers == 'all', language),
  })

  const offers = isSuccess ? (data as any) : []

  // const handleViewOffer = (offerId: number) => {
  //   console.log('clicked')
  // }

  return (
    <>
      {isFetching && <Loading />}

      {isSuccess && (
        <VStack className="gap-4 p-3 flex-1">
          {/* Header */}
          <Box className="bg-white rounded-2xl p-5 shadow-sm">
            <VStack className="gap-3">
              <HStack className="items-center justify-between">
                <VStack className="gap-1">
                  <Text className="text-primary-500 text-sm font-medium uppercase tracking-wide">Job offers</Text>
                  <Heading size="2xl" className="text-typography-900">
                    Current Job List ({offers?.length})
                  </Heading>
                </VStack>
              </HStack>

              {/* Filter */}
              <Box>
                <Select selectedValue={ownOffers} onValueChange={setOwnOffers}>
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
            data={offers}
            renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
            // ListEmptyComponent={<ListEmptyComponent message={t('noProUserJobOffers')} />}
            // ListHeaderComponent={() => <JobOffersListHeader setOwnOffersFilter={onChange} filterValue={ownOffers} />}
          />
        </VStack>
      )}
    </>
  )
}

export default JobOfferList
