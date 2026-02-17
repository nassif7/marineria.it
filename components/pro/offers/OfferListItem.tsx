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
import { Eye, Calendar, Euro, CheckCircle, Clock, AlertCircle, Briefcase, MapPin } from 'lucide-react-native'
import { router } from 'expo-router'
import { OfferType } from '@/api/types'
import { Linking } from 'react-native'

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
    <Box key={offer.idoffer} className="bg-white p-3">
      <VStack className="gap-1">
        {/* Title */}
        <Heading size="lg" className="text-primary-600 leading-tight">
          {offer.offer.trim()}
        </Heading>

        {/* Reference & Date */}
        <HStack className="justify-between items-center border-b border-background-200 pb-2">
          <Text className="text-typography-800 text-xs ">[Ref: {offer.reference.split('_')[1]}]</Text>
          <Text className="text-typography-800 text-xs">{offer.offerdate}</Text>
        </HStack>

        {/* Status Badges */}
        {(offer.alreadyApplied || !offer.offerApplicable) && (
          <HStack className="gap-2 flex-wrap py-1">
            {offer.alreadyApplied && (
              <Badge action="info" variant="outline" className="rounded-sm">
                <BadgeIcon as={CheckCircle} />
                <BadgeText>Already Applied</BadgeText>
              </Badge>
            )}
            {!offer.offerApplicable && (
              <Badge action="warning" variant="outline" className="rounded-sm">
                <BadgeIcon as={AlertCircle} />
                <BadgeText>Not applicable</BadgeText>
              </Badge>
            )}
          </HStack>
        )}
        {hasLocation && (
          <Box className="bg-background-muted border border-background-300 rounded-sm py-2 px-3">
            <Pressable onPress={handleOpenMap}>
              <HStack className="items-center gap-2 py-2 ">
                <Icon as={MapPin} className="text-primary-600" size="md" />
                <VStack className="flex-1">
                  <Text className="text-primary-600 font-semibold text-sm">{offer.positionArm || 'View Location'}</Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        )}
        {/* Salary Box */}
        <Box className="bg-background-muted border border-background-300 rounded-sm p-2 px-3">
          <HStack className="items-center gap-1 mb-1">
            <Icon as={Euro} className="text-typography-600" size="sm" />
            <Text className="text-typography-600 text-sm font-medium">Salary</Text>
          </HStack>
          <Text className="text-typography-800 font-bold text-sm">
            {offer.salary_From} - {offer.salary_To}
          </Text>
        </Box>

        {/* Duration Box */}
        <Box className="bg-background-muted border border-background-300 rounded-sm p-2 px-3">
          <HStack className="items-center gap-1 mb-1">
            <Icon as={Calendar} className="text-typography-600" size="sm" />
            <Text className="text-typography-600 text-sm font-medium">Duration</Text>
          </HStack>
          <Text className="text-typography-800 font-bold text-sm">From: {offer.offerdate}</Text>
          <Text className="text-typography-800 font-bold text-sm">To: {offer.duration}</Text>
        </Box>

        {/* View Button */}
        <Button
          size="lg"
          action="positive"
          variant="solid"
          onPress={() => handleViewOffer(offer.idoffer)}
          className="w-full rounded-sm mt-2"
        >
          <ButtonIcon as={Eye} />
          <ButtonText className="ml-2">View offer</ButtonText>
        </Button>
      </VStack>
    </Box>
  )
}

export default OfferListItem
