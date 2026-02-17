import React from 'react'
import { FileText, Calendar, Euro } from 'lucide-react-native'
import { OfferType } from '@/api/types'
import { Box, VStack, HStack, Text, Icon } from '@/components/ui'
import { SectionHeader, Section, SubSection } from '@/components/appUI'

interface OfferContractProps {
  offer: OfferType
}

const OfferContract: React.FC<OfferContractProps> = ({ offer }) => {
  return (
    <Section>
      <SectionHeader title="Contract & Compensation" icon={FileText} />
      <VStack className="gap-2">
        {/* Salary & Duration Grid */}
        <SubSection>
          {' '}
          <HStack className="items-center gap-1 mb-1">
            <Icon as={Euro} className="text-typography-600" size="sm" />
            <Text className="text-typography-600 text-sm font-medium">Salary</Text>
          </HStack>
          <Text className="text-typography-800 font-bold text-sm">
            {offer.salary_From} - {offer.salary_To}
          </Text>
        </SubSection>

        {/* Duration Box */}
        <SubSection>
          <HStack className="items-center gap-1 mb-1">
            <Icon as={Calendar} className="text-typography-600" size="sm" />
            <Text className="text-typography-600 text-sm font-medium">Duration</Text>
          </HStack>
          <Text className="text-typography-800 font-bold text-sm">From: {offer.offerdate}</Text>
          <Text className="text-typography-800 font-bold text-sm">To: {offer.duration}</Text>
        </SubSection>

        {/* Expiration */}
        <SubSection>
          <HStack className="items-center gap-1 mb-1">
            <Text className="text-typography-600 text-sm font-medium">Offer expires</Text>
          </HStack>
          <Text className="text-typography-800 font-bold text-sm">{offer.offertExpirationdate}</Text>
        </SubSection>

        {/* Contract Details */}
        <VStack className="gap-2">
          <HStack className="items-start gap-2">
            <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Contract Type:</Text>
            <Text className="text-typography-900 text-sm font-semibold flex-1">{offer.contractDescription}</Text>
          </HStack>

          <HStack className="items-start gap-2">
            <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Boarding:</Text>
            <Text className="text-typography-900 text-sm font-semibold flex-1">{offer.boarding}</Text>
          </HStack>

          <HStack className="items-start gap-2">
            <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Owner Type:</Text>
            <Text className="text-typography-900 text-sm font-semibold flex-1">{offer.ownerDescription}</Text>
          </HStack>

          {offer.gender && (
            <HStack className="items-start gap-2">
              <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Gender:</Text>
              <Text className="text-typography-900 text-sm font-semibold flex-1">{offer.gender}</Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Section>
  )
}

export default OfferContract
