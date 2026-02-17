// components/offers/OfferPosition.tsx
import React from 'react'
import { Box, VStack, HStack, Heading, Text, Icon } from '@/components/ui'
import { Briefcase, CheckCircle } from 'lucide-react-native'
import { OfferType } from '@/api/types'
import { SectionHeader, Section, SubSection } from '@/components/appUI'

interface OfferPositionProps {
  offer: OfferType
}

const OfferPosition: React.FC<OfferPositionProps> = ({ offer }) => {
  return (
    <Section>
      <SectionHeader title="Position & Requirements" icon={Briefcase} />
      <VStack className="gap-2">
        {/* Main Position */}
        <Box className="bg-background-50 border border-outline-200 rounded-sm px-4 py-4">
          <VStack className="gap-2">
            <HStack className="items-center gap-2">
              <Icon as={Briefcase} className="" size="sm" />
              <Text className="">Main Position</Text>
            </HStack>
            <Heading size="xl" className="">
              {offer.mainPosition}
            </Heading>
          </VStack>
        </Box>

        {/* Requirements */}
        {offer.requirements && (
          <SubSection>
            <VStack className="gap-2">
              <HStack className="items-center gap-2">
                <Icon as={CheckCircle} className="" size="sm" />
                <Text className="">Requirements</Text>
              </HStack>
              <Text className="text-typography-800 font-bold text-sm">{offer.requirements}</Text>
            </VStack>
          </SubSection>
        )}

        {/* Description */}
        {offer.descriptionOffer && (
          <SubSection>
            <VStack className="gap-2">
              <HStack className="items-center gap-2">
                <Icon as={CheckCircle} className="" size="sm" />
                <Text className="">Job Description</Text>
              </HStack>
              <Text className="text-typography-800 font-bold text-sm">
                {offer.descriptionOffer.replace(/<\/?b>/g, '')}
              </Text>
            </VStack>
          </SubSection>
        )}
      </VStack>
    </Section>
  )
}

export default OfferPosition
