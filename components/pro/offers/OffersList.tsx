import { FC, useState } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProOffers } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Box, VStack, HStack, Text, Divider, Loading, View, Icon } from '@/components/ui'
import { ChevronDown, Briefcase } from 'lucide-react-native'
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

const selectOptions = [
  { label: 'filter.all-offers', value: 'all' },
  { label: 'filter.own-offers', value: 'own' },
]

const ListHeader: FC<{
  itemsCount: number
  ownOffers: string
  setOwnOffers: (value: string) => void
}> = ({ itemsCount, ownOffers, setOwnOffers }) => {
  const { t } = useTranslation(['offers-screen'])
  return (
    <Box className="mb-1">
      <Box className="bg-white p-2">
        <VStack className="gap-2">
          <HStack className="items-center justify-between gap-4">
            {/* <Box className="bg-success-100 rounded-xl p-3">
              <Icon as={Briefcase} className="text-success-600" size="lg" />
            </Box> */}
            <Box>
              <Select
                defaultValue={ownOffers}
                onValueChange={setOwnOffers}
                initialLabel={t(selectOptions.find((o) => o.value === ownOffers)?.label as string)}
                className=" bg-white rounded-lg"
              >
                <SelectTrigger variant="outline" size="lg" className="w-80 flex justify-between pr-2">
                  <SelectInput className="text-typography-900 text-md font-semibold" />
                  <SelectIcon as={ChevronDown} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    {selectOptions.map((o) => (
                      <SelectItem
                        textStyle={{
                          style: {
                            padding: 8,
                            fontSize: 18,
                            fontWeight: 'bold',
                          },
                        }}
                        label={t(o.label)}
                        value={o.value}
                        key={o.value}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
            <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
              <Text className="text-white font-bold text-base">{itemsCount}</Text>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

const JobOfferList: FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offers-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [ownOffers, setOwnOffers] = useState<string>('all')

  const { isFetching, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offers', ownOffers],
    queryFn: () => getProOffers(token, ownOffers == 'all', language),
  })

  return (
    <View className=" h-full px-2 flex-1 pb-2 bg-background-100">
      {isFetching && <Loading />}
      {isSuccess && (
        <>
          <FlatList
            ListHeaderComponent={() => (
              <ListHeader itemsCount={data?.length || 0} ownOffers={ownOffers} setOwnOffers={setOwnOffers} />
            )}
            ItemSeparatorComponent={() => <Divider className="my-0.5 bg-transparent" />}
            data={data}
            renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} className="text-primary-600" />
            }
          />
        </>
      )}
      {isError && <Text className="text-error-600 text-center">{t('error')}</Text>}
    </View>
  )
}

export default JobOfferList

{
  /* <HStack className="items-center gap-3 flex-1">
              <Box className="bg-success-100 rounded-xl p-3">
                <Icon as={Briefcase} className="text-success-600" size="lg" />
              </Box>
              <VStack className="gap-0.5">
                <Text className="text-typography-700 text-md">{t('jobList')}</Text>
              </VStack>
            </HStack> */
}
