import React from 'react'
import { FileText, Calendar, Euro, MapPin } from 'lucide-react-native'
import { OfferType } from '@/api/types'
import { VStack, HStack, Text, Pressable } from '@/components/ui'
import { SectionHeader, Section, SubSection, SubSectionHeader } from '@/components/appUI'
import { Linking } from 'react-native'

interface OfferContractProps {
  offer: OfferType
}

const OfferContract: React.FC<OfferContractProps> = ({ offer }) => {
  const handleOpenMap = () => {
    if (offer.latArm && offer.lngArm && offer.latArm !== 0 && offer.lngArm !== 0) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latArm},${offer.lngArm}`
      Linking.openURL(url)
    }
  }
  const hasLocation = offer.positionArm || (offer.latArm !== 0 && offer.lngArm !== 0)

  return (
    <Section>
      <SectionHeader title="Contract & Compensation" icon={FileText} />
      <VStack className="gap-1">
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

        {/* Duration Box */}
        <SubSection>
          <HStack className="items-center gap-1 mb-1">
            <SubSectionHeader icon={Calendar} title="Duration" />
          </HStack>
          <Text size="sm" semiBold shade={800}>
            From: {offer.offerdate}
          </Text>
          <Text size="sm" semiBold shade={800}>
            To: {offer.duration}
          </Text>
        </SubSection>

        {/* Contract Details */}
        <VStack className="pl-2">
          <HStack className="items-start gap-1">
            <Text size="sm" className="w-32 shrink-0 ">
              Contract Type:
            </Text>
            <Text size="sm" shade={800} className="flex-1">
              {offer.contractDescription}
            </Text>
          </HStack>

          <HStack className="items-start gap-1">
            <Text size="sm" className="w-32 shrink-0 ">
              Boarding:
            </Text>
            <Text size="sm" shade={800} className="flex-1">
              {offer.boarding}
            </Text>
          </HStack>

          <HStack className="items-start gap-1">
            <Text size="sm" className="w-32 shrink-0 ">
              Owner Type:
            </Text>
            <Text size="sm" shade={800} className="flex-1">
              {offer.ownerDescription}
            </Text>
          </HStack>

          {/* {offer.gender && (
            <HStack className="items-start gap-1">
              <Text size="sm" shade={600} className="w-32 shrink-0 ">
                Gender:
              </Text>
              <Text size="sm" className="flex-1">
                {offer.gender}
              </Text>
            </HStack>
          )} */}
        </VStack>
      </VStack>
    </Section>
  )
}

export default OfferContract
