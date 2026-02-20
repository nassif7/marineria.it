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
} from '@/components/ui'
import { Eye, Calendar, Euro, CheckCircle, AlertCircle, MapPin } from 'lucide-react-native'
import { router } from 'expo-router'
import { OfferType } from '@/api/types'
import { Linking } from 'react-native'
import { SubSection, SubSectionHeader } from '@/components/appUI'

interface IOfferListItemProps {
  offer: OfferType
}

const OfferListItem: FC<IOfferListItemProps> = ({ offer }) => {
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
      <VStack className="gap-1">
        {/* Title */}
        <Heading size="lg" className="text-primary-600 leading-tight">
          {offer.offer.trim()}
        </Heading>
        {/* Reference & Date */}
        <HStack className="justify-between items-center border-b border-background-200 pb-2">
          <Text size="xs" shade={400}>
            [Ref: {offer.reference.split('_')[1]}]
          </Text>
          <Text shade={400} size="xs">
            {offer.offerdate}
          </Text>
        </HStack>
        {/* Status Badges */}
        {(offer.alreadyApplied || !offer.offerApplicable) && (
          <HStack className="gap-2 flex-wrap py-1">
            {offer.alreadyApplied && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeIcon as={CheckCircle} className="mr-1 text-typography-800" />
                <BadgeText className="text-typography-800">Already Applied</BadgeText>
              </Badge>
            )}
            {!offer.offerApplicable && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeIcon as={AlertCircle} className="mr-1 text-typography-800" />
                <BadgeText className="text-typography-800">Not applicable</BadgeText>
              </Badge>
            )}
          </HStack>
        )}
        {/* Salary  Location Box */}
        <HStack className="gap-1">
          <SubSection className="flex-1">
            <VStack>
              <SubSectionHeader icon={Euro} title="Salary" />
              <Text size="sm" semiBold shade={800}>
                {offer.salary_From} - {offer.salary_To}
              </Text>
            </VStack>
          </SubSection>
          {hasLocation && (
            <SubSection className="flex-1 ">
              <VStack>
                <SubSectionHeader icon={MapPin} title="Location" />
                <Pressable onPress={console.log}>
                  <Text color="primary" size="sm" semiBold>
                    {offer.positionArm || 'View on Map'}
                  </Text>
                </Pressable>
              </VStack>
            </SubSection>
          )}
        </HStack>
        <SubSection>
          <SubSectionHeader icon={Calendar} title="Duration" />
          <Text size="sm" semiBold shade={800}>
            From: {offer.offerdate}
          </Text>
          <Text size="sm" semiBold shade={800}>
            To: {offer.duration}
          </Text>
        </SubSection>
        <Button
          size="lg"
          action="positive"
          variant="solid"
          onPress={() => handleViewOffer(offer.idoffer)}
          className="w-full rounded-md "
        >
          <ButtonIcon as={Eye} />
          <ButtonText className="ml-2">View offer</ButtonText>
        </Button>
      </VStack>
    </Box>
  )
}

export default OfferListItem
