import React from 'react'
import { FileText, Calendar, Euro, MapPin } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { VStack, HStack, Text, Pressable } from '@/lib/components/ui'
import { SectionHeader, Section, SubSection, SubSectionHeader } from '@/lib/components'
import { Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { isDateString } from '@/lib/utils/dateUtils'

interface OfferContractProps {
  offer: TOffer
}

const OfferContract: React.FC<OfferContractProps> = ({ offer }) => {
  const { t } = useTranslation()

  const handleOpenMap = () => {
    if (offer.latArm && offer.lngArm && offer.latArm !== 0 && offer.lngArm !== 0) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latArm},${offer.lngArm}`
      Linking.openURL(url)
    }
  }
  const hasLocation = offer.positionArm || (offer.latArm !== 0 && offer.lngArm !== 0)

  return (
    <Section>
      <SectionHeader title={t('contract-and-compensation')} icon={FileText} />
      <VStack space="xs">
        <HStack space="xs">
          <SubSection className="flex-1" title={t('salary')} icon={Euro}>
            <Text size="sm" semiBold shade={800}>
              {offer.salary_From} - {offer.salary_To}
            </Text>
          </SubSection>
          {hasLocation && (
            <SubSection className="flex-1" title={t('location')} icon={MapPin}>
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

        {/* Contract Details */}
        <VStack className="pl-2">
          <HStack className="items-start" space="xs">
            <Text size="sm" className="w-32 shrink-0 ">
              {t('contract-type')}:
            </Text>
            <Text size="sm" shade={800} className="flex-1">
              {offer.contractDescription}
            </Text>
          </HStack>
          <HStack className="items-start" space="xs">
            <Text size="sm" className="w-32 shrink-0 ">
              {t('owner-type')}:
            </Text>
            <Text size="sm" shade={800} className="flex-1">
              {offer.ownerDescription}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Section>
  )
}

export default OfferContract
