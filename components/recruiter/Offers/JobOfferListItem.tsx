import React, { FC } from 'react'
import { JobOfferTypes } from '@/api/types'
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
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { EyeIcon, Edit, Users, UserSearch, Map } from 'lucide-react-native'
import * as Linking from 'expo-linking'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'

interface JobOfferProps {
  offer: JobOfferTypes.OwnerJobOfferType
}

const JobOfferListItem: FC<JobOfferProps> = ({ offer }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const onViewOffer = () =>
    router.push({
      pathname: '/(tabs)/recruiterScreens/offers/offer',
      params: { offerStr: JSON.stringify(offer) },
    })

  const onEditOffer = () => {
    console.log('click')
    Linking.openURL(`https://www.marineria.it/${'ENG'}/Rec/Post.aspx?idofferta=${offer.idoffer}?token=${token}`)
  }

  const onViewCrewList = () =>
    router.push({
      pathname: '/(tabs)/recruiterScreens/crew',
      params: { offerId: offer.idoffer },
    })

  const onSearchByLocation = () => {
    Linking.openURL(`https://www.marineria.it/${language}/${offer.listgeourl}?token=${token}`)
  }
  const onSearchBySkill = () => {
    Linking.openURL(`https://www.marineria.it/${language}/${offer.listurl}?token=${token}`)
  }

  return (
    <>
      <Box className="w-full p-3 bg-secondary-100 mb-4 rounded-lg">
        {/* Main Offer Title */}
        <Box className="mb-2">
          <Heading size="xl" className="text-primary-600 leading-tight break-words">
            {offer.title.trim()}
          </Heading>
        </Box>
        {/* Header Section */}
        <Box className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <HStack className="justify-between items-start gap-3">
            <VStack className="gap-1 flex-1">
              <HStack className="items-center gap-2">
                <Text className="text-success-600 font-semibold text-sm">{t('offer.search-id')}:</Text>
                <Text className="text-success-700 font-bold text-base">
                  {offer.reference.substring(offer.reference.indexOf('_') + 1)}
                </Text>
              </HStack>
              <Text className="text-typography-500 text-xs">{offer.offerdate}</Text>
            </VStack>
            <Button variant="solid" action="positive" onPress={onEditOffer} className="rounded-lg">
              <ButtonIcon as={Edit} />
              <ButtonText>{t('offer.edit-offer-short')}</ButtonText>
            </Button>
          </HStack>
        </Box>

        <Card className="p-3 rounded-lg">
          {/* Position Card */}
          <Box className="p-2 border border-secondary-200  rounded-lg bg-white mb-3">
            <Pressable onPress={onViewOffer} className="">
              <HStack className="items-center gap-3">
                <Box className="flex-1 min-w-0">
                  <Heading size="sm" className="break-words">
                    {offer.offer.trim()}
                  </Heading>
                </Box>
                <Icon as={EyeIcon} className="text-primary-600" size="lg" />
              </HStack>
            </Pressable>
          </Box>

          {/* Candidates Stats Card */}
          <Box className=" border border-secondary-200 rounded-lg p-2 mb-3">
            <Pressable onPress={onViewCrewList}>
              <HStack className="items-center gap-3">
                <Box className="bg-white rounded-lg border border-success-600 p-2.5 shadow-sm">
                  <Icon as={Users} className="text-success-600" size="lg" />
                </Box>
                <VStack className="flex-1 gap-1">
                  <Text className="text-typography-700 font-semibold text-base">
                    {offer.countCandidates} {t('offer.candidates')}
                  </Text>
                  <HStack className="gap-2 flex-wrap">
                    <Box className="bg-success-100 rounded-lg px-3 py-1">
                      <Text className="text-success-700 text-xs font-semibold">
                        {t('offer.contacted')}: {offer.countContacted}
                      </Text>
                    </Box>
                    <Box className="bg-warning-100 rounded-lg px-3 py-1">
                      <Text className="text-warning-700 text-xs font-semibold">
                        {t('offer.residual')}: {offer.countResidual}
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
            <Button size="lg" variant="solid" action="positive" onPress={onSearchBySkill} className="rounded-lg w-full">
              <ButtonIcon as={UserSearch} size="md" />
              <ButtonText className="ml-2 flex-1 text-left">{t('crew.find-by-skill')}</ButtonText>
            </Button>
            <Button
              size="lg"
              variant="solid"
              action="positive"
              onPress={onSearchByLocation}
              className="rounded-lg w-full"
            >
              <ButtonIcon as={Map} size="md" />
              <ButtonText className="ml-2 flex-1 text-left">{t('crew.find-by-location')}</ButtonText>
            </Button>
          </VStack>
        </Card>
      </Box>
    </>
  )
}

export default JobOfferListItem
