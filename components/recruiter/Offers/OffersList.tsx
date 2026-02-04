import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getOwnerOffers } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading, ListEmptyComponent, Box, Heading, VStack, HStack, Text, Icon } from '@/components/ui'
import JobOfferListItem from './JobOfferListItem'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useFocusEffect } from '@react-navigation/native'
import {
  CircleCheck,
  CircleX,
  EyeIcon,
  Edit,
  Users,
  UserSearch,
  Locate,
  Map,
  MapPin,
  Target,
  View,
  Briefcase,
} from 'lucide-react-native'
const OffersList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const firstTimeRef = React.useRef(true)
  const queryClient = useQueryClient()

  const { data, isFetching, status, isSuccess } = useQuery({
    queryKey: ['recruiter-offers'],
    queryFn: () => getOwnerOffers(token, language),
    enabled: state === 'active',
  })

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (firstTimeRef.current) {
  //       firstTimeRef.current = false
  //       return
  //     }

  //     // refetch all stale active queries
  //     queryClient.refetchQueries({
  //       queryKey: ['recruiter-offers'],
  //       stale: true,
  //       type: 'active',
  //     })
  //   }, [queryClient])
  // )

  // console.log(
  //   data?.map((i) => {
  //     return {
  //       published: i.offerPublished,
  //       credit: i.credit,
  //       paid: i.paid,
  //     }
  //   })
  // )
  // we show offers that are paid, published and have credit
  // Check with Andrea if the data is already filters on the the server
  return (
    <>
      {isFetching && <Loading />}
      {isSuccess && data && (
        <>
          {/* <Box className=" p-4">
            <Heading size="2xl" className="text-white">
              {t('jobList')} ({(data as any)?.length}):
            </Heading>
          </Box> */}
          {/* <Box className="bg-white px-5 py-6 mb-4 rounded-3xl mt-100">
            <HStack className="items-center justify-between gap-3">
              <VStack className="flex-1 gap-1">
                <Text className="text-typography-500 text-sm font-medium uppercase tracking-wide">
                  {t('offer.job-list') || 'Job List'}
                </Text>
                <Heading size="2xl" className="text-typography-900 leading-tight">
                  {t('offer.current-jobs') || 'Current Jobs'}
                </Heading>
              </VStack>
              <Box className="bg-success-100 rounded-full w-14 h-14 items-center justify-center">
                <Text className="text-success-700 font-bold text-xl">6</Text>
              </Box>
            </HStack>
          </Box> */}
          <Box className="mb-4">
            <Box className="bg-white rounded-xl p-5 shadow-sm border border-outline-100">
              <HStack className="items-center justify-between gap-4">
                <HStack className="items-center gap-3 flex-1">
                  <Box className="bg-success-100 rounded-xl p-3">
                    <Icon as={Briefcase} className="text-success-600" size="lg" />
                  </Box>
                  <VStack className="gap-0.5">
                    <Heading size="xl" className="text-typography-900">
                      {'Current Jobs'}
                    </Heading>
                    <Text className="text-typography-500 text-sm">{'Manage your active searches'}</Text>
                  </VStack>
                </HStack>
                <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
                  <Text className="text-white font-bold text-base">{(data as any)?.length}</Text>
                </Box>
              </HStack>
            </Box>
          </Box>
          <FlatList
            data={(data as any).filter((i: any) => i.paid && !i.offerPublished && i.credit)}
            renderItem={({ item }) => <JobOfferListItem offer={item} key={item.reference} />}
            ListEmptyComponent={<ListEmptyComponent message={t('noOwnerJobOffers')} />}
          />
        </>
      )}
    </>
  )
}

export default OffersList
