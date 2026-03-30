// components/offers/OfferLocation.tsx
import React from 'react'
import { Linking } from 'react-native'
import { Box, VStack, HStack, Heading, Text, Icon, Pressable } from '@/lib/components/ui'
import { MapPin } from 'lucide-react-native'
import { TOffer } from '@/api/types'

interface OfferLocationProps {
  offer: TOffer
}

const OfferLocation: React.FC<OfferLocationProps> = ({ offer }) => {
  const hasLocation = offer.positionArm || (offer.latArm !== 0 && offer.lngArm !== 0)

  const handleOpenMap = () => {
    if (offer.latArm && offer.lngArm && offer.latArm !== 0 && offer.lngArm !== 0) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latArm},${offer.lngArm}`
      Linking.openURL(url)
    }
  }

  if (!hasLocation) return null

  return (
    <Box className="bg-white rounded-2xl p-5 shadow-sm">
      <HStack className="items-center gap-2 mb-3">
        <Icon as={MapPin} className="text-primary-600" size="md" />
        <Heading size="md" className="text-primary-600">
          Location
        </Heading>
      </HStack>

      <Pressable onPress={handleOpenMap}>
        <Box className="bg-primary-50 rounded-lg p-4 active:bg-primary-100">
          <HStack className="items-center gap-3">
            <Icon as={MapPin} className="text-primary-600" size="lg" />
            <VStack className="flex-1">
              <Text className="text-primary-900 font-bold text-lg">{offer.positionArm || 'View on Map'}</Text>
              {offer.latArm !== 0 && offer.lngArm !== 0 && (
                <Text className="text-primary-600 text-sm mt-1">Tap to view on Google Maps →</Text>
              )}
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    </Box>
  )
}

export default OfferLocation
