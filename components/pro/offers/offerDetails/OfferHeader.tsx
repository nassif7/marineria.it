// components/offers/OfferHeader.tsx
import React from 'react'
import { Box, VStack, HStack, Heading, Text, Divider } from '@/components/ui'
import { OfferType } from '@/api/types'

interface OfferHeaderProps {
  offer: OfferType
}

const OfferHeader: React.FC<OfferHeaderProps> = ({ offer }) => {
  return (
    <Box className="bg-white rounded-sm p-3">
      <VStack className="gap-2">
        {/* Reference & Date */}
        <HStack className="justify-between items-start">
          <VStack className="gap-1">
            <Text className="text-typography-600 text-xs font-medium uppercase tracking-wide">Job Reference</Text>
            <Text className="text-typography-800 font-bold text-lg">{offer.reference.split('_')[1]}</Text>
          </VStack>

          <VStack className="items-end gap-1">
            <Text className="text-typography-600 text-xs">Posted</Text>
            <Text className="text-typography-800 font-semibold text-sm">{offer.offerdate}</Text>
          </VStack>
        </HStack>

        <Divider />

        {/* Job Title */}
        <Heading size="lg" className="text-primary-600 leading-tight">
          {offer.offer.trim()}
        </Heading>
      </VStack>
    </Box>
  )
}

export default OfferHeader
