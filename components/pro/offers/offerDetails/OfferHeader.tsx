// components/offers/OfferHeader.tsx
import React from 'react'
import { VStack, HStack, Heading, Text, Divider } from '@/lib/components/ui'
import { TOffer } from '@/api/types'
import { Section } from '@/lib/components'
import { useTranslation } from 'react-i18next'

interface IOfferHeaderProps {
  offer: TOffer
}

const OfferHeader: React.FC<IOfferHeaderProps> = ({ offer }) => {
  const { t } = useTranslation(['offer-screen'])

  return (
    <Section>
      <VStack space="xs">
        <HStack className="justify-between items-start">
          <VStack className="gap-1">
            <Text size="sm">{t('job-reference')}</Text>
            <Text size="sm" semiBold shade={800}>
              {offer.reference.split('_')[1]}
            </Text>
          </VStack>

          <VStack className="items-end gap-1">
            <Text size="sm">{t('posted')}</Text>
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
