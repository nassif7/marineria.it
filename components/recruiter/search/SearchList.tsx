import { FC } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getRecruiterActiveSearches } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Loading, ListEmptyComponent, Box, Heading, VStack, HStack, Text, Icon, View, Divider } from '@/components/ui'
import SearchItem from './SearchItem'
import { useQuery } from '@tanstack/react-query'
import { Briefcase } from 'lucide-react-native'
// import { useFocusEffect } from '@react-navigation/native'
//#TODO: get the offers when the app state change from inactive to active
import { SafeAreaView } from 'react-native'
const OwnerSearchList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const state = useAppState()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['recruiter-search-list'],
    queryFn: () => getRecruiterActiveSearches(token, language),
    enabled: state === 'active',
  })

  return (
    <View className="px-2 h-full flex-1">
      {isFetching && <Loading />}
      {isSuccess && data && (
        <>
          <Box className="mb-2">
            <Box className="bg-background-50 rounded-lg p-2 shadow-sm border border-outline-100">
              <HStack className="items-center justify-between gap-4">
                <HStack className="items-center gap-3 flex-1">
                  <Box className="bg-success-100 rounded-xl p-3">
                    <Icon as={Briefcase} className="text-success-600" size="lg" />
                  </Box>
                  <VStack className="gap-0.5">
                    <Text className="text-typography-700 text-md">{t('recruiter.active-searches-description')}</Text>
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
            data={(data as any).filter((i: any) => i.paid && !i.offerPublished && i.credit)}
            renderItem={({ item }) => <SearchItem search={item} key={item.reference} />}
            ListEmptyComponent={<ListEmptyComponent message={t('owner.no-active-searches')} />}
          />
        </>
      )}
    </View>
  )
}

export default OwnerSearchList
