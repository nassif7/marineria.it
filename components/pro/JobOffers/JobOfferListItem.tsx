import React, { FC } from 'react'
import { JobOfferTypes } from '@/api/types'
import { Box, Heading, HStack, Pressable, Card, VStack, Button, ButtonText, ButtonIcon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { CircleCheck, CircleX, EyeIcon } from 'lucide-react-native'
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge'
import { formatSalary } from '@/utils/formatters'
interface JobOfferProps {
  offer: JobOfferTypes.ProJobOfferType
}

const JobOfferListItem: FC<JobOfferProps> = ({ offer }) => {
  const { t } = useTranslation()

  const onPress = () => {
    router.navigate(`/(tabs)/proScreens/jobOffers/${offer.idoffer}`)
  }

  return (
    <Card className="p-3 m-2 rounded-lg">
      <Box className="flex-row items-center">
        <Heading size="xl" className="text-primary-600">
          {offer.offer.trim()}
        </Heading>
      </Box>
      <Box className="mt-3 flex-col border-2 border-outline-200 rounded p-2 ">
        <HStack className="w-full flex-row justify-between">
          <Heading size="sm">{`[Ref.:${offer.reference.substring(offer.reference.indexOf('_') + 1)}]`}</Heading>
          <Heading size="sm">{offer.offerdate.substring(offer.offerdate.indexOf(',') + 1)}</Heading>
        </HStack>
      </Box>
      <Box className="mt-3 flex-col border-2 border-outline-200 rounded p-2 ">
        <VStack>
          {offer?.positionArm && (
            <Heading className="text-primary-600" size="md">
              {offer.positionArm}
            </Heading>
          )}
          {(offer.salary_From || offer.salary_To) && (
            <>
              <HStack className="justify-between">
                <Heading size="sm">
                  {t('offerSalary')}: {formatSalary(offer.salary_From, offer.salary_To)}
                </Heading>
              </HStack>
            </>
          )}
          {(offer.offerdate || offer.offertExpirationdate) && (
            <HStack className="justify-between">
              <Heading size="sm">
                {offer.offerdate && t('offerFrom') + ':' + offer.offerdate.substring(offer.offerdate.indexOf(',') + 1)}
                {offer.offertExpirationdate && offer.offerdate && ' - '}
                {offer.offertExpirationdate &&
                  t('offerTo') +
                    ':' +
                    offer.offertExpirationdate.substring(offer.offertExpirationdate.indexOf(',') + 1)}
              </Heading>
            </HStack>
          )}
        </VStack>
      </Box>
      {(!offer.offerApplicable || offer.alreadyApplied) && (
        <Box className="mt-3 flex-col border-2 border-outline-200 bg-outline-50 rounded p-2 ">
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
      <Box className="mt-3 ">
        <Button className="" variant="solid" action="positive" onPress={onPress}>
          <ButtonIcon as={EyeIcon} className=" mr-2" />
          <ButtonText className="">View offer</ButtonText>
        </Button>
      </Box>
    </Card>
  )
}

export default JobOfferListItem
