// components/offers/OfferPosition.tsx
import React from 'react'
import { VStack, Text } from '@/components/ui'
import { Anchor, Briefcase, CheckCircle, FileText } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { SectionHeader, Section, SubSection, SubSectionHeader } from '@/components/appUI'
import { useTranslation } from 'react-i18next'

interface OfferPositionProps {
  offer: TOffer
}

const OfferPosition: React.FC<OfferPositionProps> = ({ offer }) => {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeader title={t('position-requirements')} icon={Briefcase} />
      <VStack space="xs">
        <SubSection title={t('main-position')} icon={Anchor}>
          <Text size="sm" semiBold shade={800}>
            {offer.mainPosition}
          </Text>
        </SubSection>
        {offer.requirements && (
          <SubSection title={t('requirements')} icon={CheckCircle}>
            <Text size="sm" semiBold shade={800}>
              {offer.requirements}
            </Text>
          </SubSection>
        )}
        {offer.descriptionOffer && (
          <SubSection icon={FileText} title={t('description')}>
            <Text size="sm" semiBold shade={800}>
              {offer.descriptionOffer.replace(/<\/?b>/g, '')}
            </Text>
          </SubSection>
        )}
      </VStack>
    </Section>
  )
}

export default OfferPosition
