import React, { FC } from 'react'
import { JobOfferTypes } from '@/api/types'
import { Box, Heading, Text, Divider, HStack, Pressable } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { CircleCheck } from 'lucide-react-native'
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge'
import { ActiveProfile, useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'

interface JobOfferProps {
  offer: JobOfferTypes.JobOfferType
}

const JobOfferListItem: FC<JobOfferProps> = ({ offer }) => {
  const { t } = useTranslation()
  const { activeProfile } = useUser()
  const { role } = activeProfile as ActiveProfile
  const isOwner = role === AuthTypes.UserRole.OWNER

  const onPress = () => {
    offer.offerApplicable || isOwner
      ? router.navigate(`/(main)/(tabs)/jobOffers/${offer.idoffer}`)
      : router.push({
          pathname: '/(main)/(tabs)/jobOffers/jobOffer',
          params: { offerStr: JSON.stringify(offer) },
        })
  }

  return (
    <Pressable className="bg-white py-2 rounded" onPress={onPress}>
      <HStack className="mb-2 justify-between align-center">
        <Heading className="text-primary-600 text-left text-xl font-bold px-3 basis-5/6 flex-wrap">
          {offer.offer.trim()}
        </Heading>
      </HStack>
      <Divider className="mb-2" />
      <HStack className="justify-between px-3 mb-2">
        <Box>
          <Text>{`[Ref.:${offer.reference.substring(offer.reference.indexOf('_') + 1)}]`}</Text>
        </Box>
        <Box className="flex-row">
          <Text>{offer.offerdate.substring(offer.offerdate.indexOf(',') + 1)}</Text>
        </Box>
      </HStack>
      <Divider className="mb-2" />
      <HStack className="px-3">
        <Box className="flex-row">
          <Text className="text-primary-600 text-lg">{offer.positionArm}</Text>
        </Box>
      </HStack>
      <HStack className="px-3 justify-between">
        <Text className=" text-lg">
          {`${t('offerSalary')}:  ${!offer.compenso_From ? 'NA' : offer.compenso_From + '-' + offer.compenso_To}`}
        </Text>
      </HStack>
      <Divider className="my-1 bg-transparent" />
      <HStack className="items-center px-2"></HStack>
      <Divider className="my-1 bg-transparent" />
      <HStack className="px-2">
        <Text className=" text-lg">
          {t('offerFrom')}:{offer.offerfrom.substring(offer.offerfrom.indexOf(',') + 1)} - {t('offerTo')}:{' '}
          {offer.offerTo.substring(offer.offerTo.indexOf(',') + 1)}
        </Text>
      </HStack>
      {(!offer.offerApplicable || offer.alreadyApplied) && (
        <HStack className="bg-secondary-200 justify-between mt-2 p-2 flex-wrap">
          {offer.alreadyApplied && (
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className={`px-2 ${!offer.offerApplicable ? 'mb-2' : ''}`}
            >
              <BadgeText bold>{t('alreadyApplied')}</BadgeText>
              <BadgeIcon as={CircleCheck} className="ml-1" />
            </Badge>
          )}
          {!offer.offerApplicable && (
            <Badge size="lg" variant="solid" action="warning" className="px-2">
              <BadgeText bold> {t('offerNotApplicable')}</BadgeText>
              <BadgeIcon as={CircleCheck} className="ml-1" />
            </Badge>
          )}
        </HStack>
      )}
    </Pressable>
  )
}

export default JobOfferListItem
