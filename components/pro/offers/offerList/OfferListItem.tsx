import { FC } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Icon,
  Badge,
  BadgeIcon,
  BadgeText,
  Pressable,
} from '@/lib/components/ui'
import { Eye, Calendar, Euro, CheckCircle, AlertCircle, MapPin } from 'lucide-react-native'
import { router } from 'expo-router'
import { TOffer } from '@/api/types'
import { Linking } from 'react-native'
import { SubSection, SubSectionHeader } from '@/components/appUI'
import { useTranslation } from 'react-i18next'
import { isDateString } from '@/lib/utils/dateUtils'

interface IOfferListItemProps {
  offer: TOffer
}

const OfferListItem: FC<IOfferListItemProps> = ({ offer }) => {
  const { t } = useTranslation(['offer-screen'])

  const handleViewOffer = (offerId: number) => {
    router.push(`/pro/offers/${offerId}`)
  }
  const handleOpenMap = () => {
    if (offer.latArm && offer.lngArm && offer.latArm !== 0 && offer.lngArm !== 0) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latArm},${offer.lngArm}`
      Linking.openURL(url)
    }
  }
  const hasLocation = offer.positionArm || (offer.latArm !== 0 && offer.lngArm !== 0)

  return (
    <Box key={offer.idoffer} className="bg-white p-4 rounded-md">
      <VStack space="xs">
        {/* Title */}
        <Heading size="lg" className="text-primary-600 leading-tight">
          {offer.title.trim()}
        </Heading>
        {/* Reference & Date */}
        <HStack className="justify-between items-center border-b border-background-200 pb-2">
          <Text size="xs" shade={400}>
            {`[${t('job-reference')}: ${offer.reference.split('_')[1]}]`}
          </Text>
          <Text shade={400} size="xs">
            {offer.offerdate}
          </Text>
        </HStack>
        {/* Status Badges */}
        {(offer.alreadyApplied || !offer.offerApplicable) && (
          <HStack className="flex-wrap py-1" space="sm">
            {offer.alreadyApplied && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeIcon as={CheckCircle} className="mr-1 text-typography-800" />
                <BadgeText className="text-typography-800">{t('already-applied')}</BadgeText>
              </Badge>
            )}
            {!offer.offerApplicable && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeIcon as={AlertCircle} className="mr-1 text-typography-800" />
                <BadgeText className="text-typography-800">{t('not-matching')}</BadgeText>
              </Badge>
            )}
          </HStack>
        )}
        {/* Salary  Location Box */}
        <HStack space="xs">
          <SubSection icon={Euro} title={t('salary')} className="flex-1">
            <Text size="sm" semiBold shade={800}>
              {offer.salary_From} - {offer.salary_To}
            </Text>
          </SubSection>
          {hasLocation && (
            <SubSection className="flex-1" icon={MapPin} title={t('location')}>
              <Pressable onPress={handleOpenMap}>
                <Text color="primary" size="sm" semiBold>
                  {offer.positionArm || 'View on Map'}
                </Text>
              </Pressable>
            </SubSection>
          )}
        </HStack>
        <SubSection icon={Calendar} title={t('period')}>
          <Text size="sm" semiBold shade={800}>
            {isDateString(offer.boarding) ? `${t('from')}:` : ''}
            {offer.boarding}
          </Text>
          <Text size="sm" semiBold shade={800}>
            {isDateString(offer.duration) ? `${t('to')}:` : ''}
            {offer.duration}
          </Text>
        </SubSection>
        <Button
          size="md"
          action="positive"
          variant="solid"
          onPress={() => handleViewOffer(offer.idoffer)}
          className="w-full rounded-md "
        >
          <ButtonText className="ml-2">{t('view-offer')}</ButtonText>
        </Button>
      </VStack>
    </Box>
  )
}

export default OfferListItem
