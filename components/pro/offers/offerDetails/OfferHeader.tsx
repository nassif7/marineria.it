// components/offers/OfferHeader.tsx
import React from 'react'
import { Box, VStack, HStack, Heading, Text, Divider } from '@/components/ui'
import { OfferType } from '@/api/types'
import { Section, SectionHeader, SubSection } from '@/components/appUI'

interface OfferHeaderProps {
  offer: OfferType
}

const OfferHeader: React.FC<OfferHeaderProps> = ({ offer }) => {
  return (
    <Section>
      <VStack className="gap-1">
        <HStack className="justify-between items-start">
          <VStack className="gap-1">
            <Text size="sm">Job Reference</Text>
            <Text size="sm" semiBold shade={800}>
              {offer.reference.split('_')[1]}
            </Text>
          </VStack>

          <VStack className="items-end gap-1">
            <Text size="sm">Posted</Text>
            <Text size="sm" semiBold shade={800}>
              {offer.offerdate}
            </Text>
          </VStack>
        </HStack>
        <Divider />
        <Heading size="lg" className="text-primary-600 leading-tight py-1">
          {offer.offer.trim()}
        </Heading>
      </VStack>
    </Section>
  )
}

export default OfferHeader
