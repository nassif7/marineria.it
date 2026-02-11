import { FlatList } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Loading, Box, HStack, Text, VStack, Icon, View, Divider } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { getCrewList } from '@/api'
import { useUser } from '@/Providers/UserProvider'
import { CrewType } from '@/api/types'
import CrewListItem from './CrewListItem'
import { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react-native'

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
    <View className="px-2">
      {isFetching && <Loading />}
      {isSuccess && (
        <>
          <Box className="mb-2">
            <Box className="bg-background-50 rounded-lg p-2 shadow-sm border border-outline-100">
              <HStack className="items-center justify-between gap-4">
                <HStack className="items-center gap-3 flex-1">
                  <Box className="bg-success-100 rounded-xl p-3">
                    <Icon as={Users} className="text-success-600" size="lg" />
                  </Box>
                  <VStack className="gap-0.5">
                    <Text className="text-typography-700 text-md">{t('recruiter.crew-list-description')}</Text>
                  </VStack>
                </HStack>
                <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
                  <Text className="text-white font-bold text-base">{(data as any)?.length}</Text>
                </Box>
              </HStack>
            </Box>
          </Box>
          <FlatList
            ItemSeparatorComponent={() => <Divider className="my-1 bg-transparent" />}
            data={data as CrewType[]}
            renderItem={({ item }) => <CrewListItem crew={item} searchId={searchId as string} />}
          />
        </>
      )}
    </View>
  )
}

export default CrewList
