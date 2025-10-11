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
  ButtonGroup,
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { CircleCheck, CircleX, EyeIcon, Edit, Users, UserSearch, Locate, Map } from 'lucide-react-native'
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge'
import { formatSalary, formatDate } from '@/utils'
import * as Linking from 'expo-linking'
import { Link } from 'expo-router'
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
    <Box className="w-full p-2">
      <Text className="text-success-500 text-right mb-2 mr-2">
        {t('offer.search-id')}: {offer.reference} {offer.offerdate}
      </Text>
      <Card className="p-2 rounded-lg">
        <Box>
          <HStack className="flex gap-1">
            <Heading size="xl" className="text-primary-600 flex-[10] ">
              {offer.offer.trim()}
            </Heading>
            <Button className="flex-[2]" variant="solid" action="positive" onPress={onEditOffer}>
              <ButtonIcon as={Edit} />
              <ButtonText>{t('offer.edit-offer-short')}</ButtonText>
            </Button>
          </HStack>
        </Box>
        <Box className="mt-3 flex-col border-2 border-outline-200 rounded p-2 ">
          <HStack className="flex gap-1 items-center">
            <Heading size="md" className="flex-[11] ">
              {offer.offer.trim()}
            </Heading>
            <Pressable onPress={onViewOffer}>
              <Icon as={EyeIcon} className="text-primary-600" />
            </Pressable>
          </HStack>
        </Box>
        <ButtonGroup className="mt-3">
          <Button className="flex justify-start" variant="outline" action="positive" onPress={onViewCrewList}>
            <ButtonIcon as={Users} className="mr-2" />
            <ButtonText className="text-success-600">
              {t('offer.offer-crew-count', {
                candidates: offer.countCandidates,
                contacted: offer.countContacted,
                residual: offer.countResidual,
              })}
            </ButtonText>
          </Button>
          <Button className="flex justify-start" variant="solid" action="positive" onPress={onSearchBySkill}>
            <ButtonIcon as={UserSearch} className="mr-2" />
            <ButtonText>{t('crew.find-by-skill')}</ButtonText>
          </Button>
          <Button className="flex justify-start" variant="solid" action="positive" onPress={onSearchByLocation}>
            <ButtonIcon as={Map} className="mr-2" />
            <ButtonText>{t('crew.find-by-location')}</ButtonText>
          </Button>
        </ButtonGroup>
      </Card>
    </Box>
  )
}

export default JobOfferListItem
