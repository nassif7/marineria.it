import React, { FC } from 'react'
import { JobOfferTypes } from '@/api/types'
import { Box, Heading, Text, Divider, HStack, Pressable, Card, VStack } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { CircleCheck, CircleX } from 'lucide-react-native'
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
            <Heading className="text-primary-600" size="md">
              {offer.positionArm}
            </Heading>
            <HStack className="justify-between">
              <Heading size="sm">
                {`${t('offerSalary')}:  ${!offer.compenso_From ? 'NA' : offer.compenso_From + '-' + offer.compenso_To}`}
              </Heading>
            </HStack>
            <HStack className="justify-between">
              <Heading size="sm">
                {t('offerFrom')}:{offer.offerfrom.substring(offer.offerfrom.indexOf(',') + 1)} - {t('offerTo')}:{' '}
                {offer.offerTo.substring(offer.offerTo.indexOf(',') + 1)}{' '}
              </Heading>
            </HStack>
          </VStack>
        </Box>

        {role === AuthTypes.UserRole.PRO && (
          <>
            {(!offer.offerApplicable || offer.alreadyApplied) && (
              <Box className="mt-4 flex-col border-2 border-outline-200 bg-outline-50 rounded p-2 ">
                <HStack className=" justify-between  flex-wrap">
                  {true && (
                    <Badge size="md" variant="outline" action="success" className={`px-2`}>
                      <BadgeText bold>{t('alreadyApplied')}</BadgeText>
                      <BadgeIcon as={CircleCheck} className="ml-1" />
                    </Badge>
                  )}
                  {true && (
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
      </Card>
    </Pressable>
  )
}

export default JobOfferListItem
