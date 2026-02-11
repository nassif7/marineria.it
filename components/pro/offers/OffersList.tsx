import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProOffers } from '@/api'
import { useAppState } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Box, VStack, HStack, Heading, Text, Divider, Loading, View, Icon } from '@/components/ui'
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
  { label: 'allOffers', value: 'all' },
  { label: 'ownOffers', value: 'own' },
]

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

  return (
    <View className="px-2">
      {isFetching && <Loading />}

      {isSuccess && (
        <>
          <Box className="mb-2">
            <Box className="bg-background-50 rounded-lg p-2 shadow-sm border border-outline-100">
              <VStack className="gap-2">
                <HStack className="items-center justify-between gap-4">
                  <HStack className="items-center gap-3 flex-1">
                    <Box className="bg-success-100 rounded-xl p-3">
                      <Icon as={Briefcase} className="text-success-600" size="lg" />
                    </Box>
                    <VStack className="gap-0.5">
                      <Text className="text-typography-700 text-md">{t('jobList')}</Text>
                    </VStack>
                  </HStack>
                  <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
                    <Text className="text-white font-bold text-base">{(data as any)?.length}</Text>
                  </Box>
                </HStack>
                <Box>
                  <Select
                    defaultValue={ownOffers}
                    onValueChange={setOwnOffers}
                    initialLabel={t(selectOptions.find((o) => o.value === ownOffers)?.label as string)}
                    className=" bg-white rounded-lg"
                  >
                    <SelectTrigger variant="outline" size="lg" className="w-full flex justify-between pr-2">
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
              </VStack>
            </Box>
          </Box>
          <FlatList
            ItemSeparatorComponent={() => <Divider className="my-1 bg-transparent" />}
            data={offers}
            renderItem={({ item }) => <OfferListItem offer={item} key={item.reference} />}
          />
        </>
      )}
    </View>
  )
}

export default JobOfferList
