import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import { EyeIcon, Edit, Users, UserSearch, Map } from 'lucide-react-native'
import { JobOfferTypes } from '@/api/types'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import {
  Box,
  Heading,
  HStack,
  Pressable,
  Card,
  VStack,
  Button,
  ButtonText,
  ButtonIcon,
  Text,
  Icon,
} from '@/components/ui'

interface SearchItemsProps {
  search: JobOfferTypes.OwnerSearchType
}

const SearchListItem: FC<SearchItemsProps> = ({ search }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const viewSearch = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}`)
  const viewCrewList = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list`)
  const handleEditSearch = () => {
    const url = `https://www.marineria.it/${language}/Rec/Post.aspx?idofferta=${search.idoffer}&token=${token}`
    Linking.openURL(url)
  }
  const openSearchByLocation = () => {
    const url = `https://www.marineria.it/${language}/${search.listgeourl}?token=${token}`
    Linking.openURL(url)
  }
  const openSearchBySkill = () => {
    const url = `https://www.marineria.it/${language}/${search.listurl}?token=${token}`
    Linking.openURL(url)
  }

  return (
    <Box className="w-full p-3 bg-background-100  rounded-lg">
      {/* Main Offer Title */}
      <Box className="mb-2">
        <Heading size="xl" className="text-primary-600 leading-tight break-words">
          {search.title.trim()}
        </Heading>
      </Box>
      {/* Header Section */}
      <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <HStack className="justify-between items-start gap-3">
          <VStack className="gap-1 flex-1">
            <HStack className="items-center gap-2">
              <Text className="text-success-600 font-semibold text-sm">{t('offer.search-id')}:</Text>
              <Text className="text-success-700 font-bold text-base">
                {search.reference.substring(search.reference.indexOf('_') + 1)}
              </Text>
            </HStack>
            <Text className="text-typography-500 text-xs">{search.offerdate}</Text>
          </VStack>
          <Button variant="solid" action="positive" onPress={handleEditSearch} className="rounded-lg">
            <ButtonIcon as={Edit} />
            <ButtonText>{t('offer.edit-offer-short')}</ButtonText>
          </Button>
        </HStack>
      </Box>

      <Card className="p-3 rounded-lg">
        {/* Position Card */}
        <Box className="p-2 border border-secondary-200  rounded-lg bg-white mb-3">
          <Pressable onPress={viewSearch} className="">
            <HStack className="items-center gap-3">
              <Box className="flex-1 min-w-0">
                <Heading size="sm" className="break-words">
                  {search.offer.trim()}
                </Heading>
              </Box>
              <Icon as={EyeIcon} className="text-primary-600" size="lg" />
            </HStack>
          </Pressable>
        </Box>

        {/* Candidates Stats Card */}
        <Box className=" border border-secondary-200 rounded-lg p-2 mb-3">
          <Pressable onPress={viewCrewList}>
            <HStack className="items-center gap-3">
              <Box className="bg-white rounded-lg border border-success-600 p-2.5 shadow-sm">
                <Icon as={Users} className="text-success-600" size="lg" />
              </Box>
              <VStack className="flex-1 gap-1">
                <Text className="text-typography-700 font-semibold text-base">
                  {search.countCandidates} {t('offer.candidates')}
                </Text>
                <HStack className="gap-2 flex-wrap">
                  <Box className="bg-success-100 rounded-lg px-3 py-1">
                    <Text className="text-success-700 text-xs font-semibold">
                      {t('offer.contacted')}: {search.countContacted}
                    </Text>
                  </Box>
                  <Box className="bg-warning-100 rounded-lg px-3 py-1">
                    <Text className="text-warning-700 text-xs font-semibold">
                      {t('offer.residual')}: {search.countResidual}
                    </Text>
                  </Box>
                </HStack>
              </VStack>
              <Icon as={EyeIcon} className="text-success-600" size="md" />
            </HStack>
          </Pressable>
        </Box>

        {/* Action Buttons */}
        <VStack className="gap-2">
          <Button size="lg" variant="solid" action="positive" onPress={openSearchBySkill} className="rounded-lg w-full">
            <ButtonIcon as={UserSearch} size="md" />
            <ButtonText className="ml-2 flex-1 text-left">{t('crew.find-by-skill')}</ButtonText>
          </Button>
          <Button
            size="lg"
            variant="solid"
            action="positive"
            onPress={openSearchByLocation}
            className="rounded-lg w-full"
          >
            <ButtonIcon as={Map} size="md" />
            <ButtonText className="ml-2 flex-1 text-left">{t('crew.find-by-location')}</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Box>
  )
}

export default SearchListItem
