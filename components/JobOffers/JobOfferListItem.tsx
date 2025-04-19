import React, { FC } from 'react'
import { JobOfferTypes } from '@/api/types'
import {
  Box,
  Heading,
  Text,
  Divider,
  HStack,
  Pressable,
  Card,
  VStack,
  Button,
  ButtonIcon,
  ButtonText,
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { CircleCheck, CircleX } from 'lucide-react-native'
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge'
import { ActiveProfile, useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'
import { formatSalary } from '@/utils/formatters'
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
      ? router.navigate(`/(tabs)/jobOffers/${offer.idoffer}`)
      : router.push({
          pathname: '/(tabs)/jobOffers/jobOffer',
          params: { offerStr: JSON.stringify(offer) },
        })
  }

  return (
    <Pressable className="m-3" onPress={onPress}>
      <Card className="p-4 rounded-lg">
        <Box className="flex-row items-center">
          <Heading size="xl" className="text-primary-600">
            {offer.offer.trim()}
          </Heading>
        </Box>
        <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
          <HStack className="w-full flex-row justify-between">
            <Heading size="sm">{`[Ref.:${offer.reference.substring(offer.reference.indexOf('_') + 1)}]`}</Heading>
            <Heading size="sm">{offer.offerdate.substring(offer.offerdate.indexOf(',') + 1)}</Heading>
          </HStack>
        </Box>

        <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
          <VStack>
            {offer?.positionArm && (
              <Heading className="text-primary-600" size="md">
                {offer.positionArm}
              </Heading>
            )}
            {(offer.compenso_From || offer.compenso_To) && (
              <>
                <HStack className="justify-between">
                  <Heading size="sm">
                    {t('offerSalary')}: {formatSalary(offer.compenso_From, offer.compenso_To)}
                  </Heading>
                </HStack>
              </>
            )}
            {(offer.offerfrom || offer.offerTo) && (
              <HStack className="justify-between">
                <Heading size="sm">
                  {offer.offerfrom &&
                    t('offerFrom') + ':' + offer.offerfrom.substring(offer.offerfrom.indexOf(',') + 1)}
                  - {offer.offerTo && t('offerTo') + ':' + offer.offerTo.substring(offer.offerTo.indexOf(',') + 1)}
                </Heading>
              </HStack>
            )}
          </VStack>
        </Box>

        {role === AuthTypes.UserRole.PRO && (
          <>
            {(!offer.offerApplicable || offer.alreadyApplied) && (
              <Box className="mt-4 flex-col border-2 border-outline-200 bg-outline-50 rounded p-2 ">
                <HStack className=" justify-between  flex-wrap">
                  {offer.alreadyApplied && (
                    <Badge size="md" variant="outline" action="success" className={`px-2`}>
                      <BadgeText bold>{t('alreadyApplied')}</BadgeText>
                      <BadgeIcon as={CircleCheck} className="ml-1" />
                    </Badge>
                  )}
                  {!offer.offerApplicable && (
                    <Badge size="md" variant="outline" action="warning" className="">
                      <BadgeText bold> {t('offerNotApplicable')}</BadgeText>
                      <BadgeIcon as={CircleX} className="ml-1" />
                    </Badge>
                  )}
                </HStack>
              </Box>
            )}
          </>
        )}
        {role === AuthTypes.UserRole.OWNER && (
          <Button className="py-2 px-4" variant="outline" action="positive" onPress={onPress}>
            {/* <ButtonIcon as={EyeIcon} className="text-success-400 mr-2" /> */}
            <ButtonText className="text-success-400">View crew list</ButtonText>
          </Button>
        )}
      </Card>
    </Pressable>
  )
}

export default JobOfferListItem
