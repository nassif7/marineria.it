import { SafeAreaView, ImageBackground, ScrollView, FlatList, TouchableHighlight, Platform } from 'react-native'
import { useLocalSearchParams, useRouter, usePathname } from 'expo-router'
import {
  Loading,
  Box,
  Heading,
  HStack,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  ButtonGroup,
  VStack,
  Icon,
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { getOwnerOfferById, getProOfferById, applyToOffer, getCrewList } from '@/api'
import { Share, Alert } from 'react-native'
import { useUser } from '@/Providers/UserProvider'
import { useCallback } from 'react'
import { AuthTypes, CrewType } from '@/api/types'
import { useFetch } from '@/hooks'
import CrewListItem from './CrewListItem'
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Users } from 'lucide-react-native'

const CrewList: FC = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { searchId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as any

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['recruiter-crew-list', searchId],
    queryFn: () => getCrewList(searchId as string, token, language),
  })

  console.log(data)
  // const fetchCrewList = useCallback(
  //   async () => await getCrewList(searchId as string, token, language),
  //   [token, language, searchId]
  // )
  // const crewListData = useFetch(fetchCrewList)
  // const crewList = crewListData?.data as CrewType[]

  // if (!crewListData?.isLoading && !crewListData?.data?.length) {
  //   console.log('no items matching')
  // }

  return (
    <>
      {isFetching && <Loading />}
      {isSuccess && (
        <>
          <Box className="mb-4">
            <Box className="bg-white rounded-lg p-4 shadow-sm border border-outline-100">
              <HStack className="items-center justify-between gap-4">
                <HStack className="items-center gap-3 flex-1">
                  <Box className="bg-success-100 rounded-xl p-3">
                    <Icon as={Users} className="text-success-600" size="lg" />
                  </Box>
                  <VStack className="gap-0.5">
                    <Heading size="xl" className="text-typography-900">
                      {t('recruiter.crew-list')}
                    </Heading>
                    <Text className="text-typography-500 text-sm">{t('recruiter.crew-list-description')}</Text>
                  </VStack>
                </HStack>
                <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
                  <Text className="text-white font-bold text-base">{(data as any)?.length}</Text>
                </Box>
              </HStack>
            </Box>
          </Box>
          <FlatList
            data={data as CrewType[]}
            renderItem={({ item }) => <CrewListItem crew={item} searchId={searchId as string} />}
          />
        </>
      )}
    </>
  )
}

export default CrewList
