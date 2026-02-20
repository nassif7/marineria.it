// components/offers/OfferPosition.tsx
import React from 'react'
import { VStack, Text } from '@/components/ui'
import { Anchor, Briefcase, CheckCircle, FileText } from 'lucide-react-native'
import { OfferType } from '@/api/types'
import { SectionHeader, Section, SubSection, SubSectionHeader } from '@/components/appUI'

interface OfferPositionProps {
  offer: OfferType
}

const OfferPosition: React.FC<OfferPositionProps> = ({ offer }) => {
  return (
    <Section>
      <SectionHeader title="Position & Requirements" icon={Briefcase} />
      <VStack className="gap-1">
        <SubSection>
          <SubSectionHeader icon={Anchor} title="Main Position" />
          <Text size="sm" semiBold shade={800}>
            {offer.mainPosition}
          </Text>
        </SubSection>
        {offer.requirements && (
          <SubSection>
            <VStack className="gap-2">
              <SubSectionHeader icon={CheckCircle} title="Requirements" />
              <Text size="sm" semiBold shade={800}>
                {offer.requirements}
              </Text>
            </VStack>
          </SubSection>
        )}
        {offer.descriptionOffer && (
          <SubSection>
            <VStack className="gap-2">
              <SubSectionHeader icon={FileText} title="Job Description" />
              <Text size="sm" semiBold shade={800}>
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
