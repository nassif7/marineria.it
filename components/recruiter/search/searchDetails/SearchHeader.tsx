// components/search/SearchHeader.tsx
import React from 'react'
import { VStack, HStack, Heading, Text, Divider } from '@/lib/components/ui'
import { useTranslation } from 'react-i18next'
import { TRecruiterSearch } from '@/api/types'
import { Section } from '@/lib/components'

interface ISearchHeaderProps {
  search: TRecruiterSearch
  onEdit: () => void
}

const SearchHeader: React.FC<ISearchHeaderProps> = ({ search }) => {
  const { t } = useTranslation(['search-screen'])

  return (
    <Section>
      <VStack space="xs">
        <HStack className="justify-between items-start">
          <VStack className="gap-1">
            <Text size="sm">{t('search-id')}</Text>
            <Text size="sm" semiBold shade={800}>
              {search.reference.split('_')[1]}
            </Text>
          </VStack>
          <VStack className="items-end gap-1">
            <Text size="sm">{t('posted')}</Text>
            <Text size="sm" semiBold shade={800}>
              {search.offerdate}
            </Text>
          </VStack>
        </HStack>
        <Divider />
        <Heading size="lg" className="text-primary-600 leading-tight py-1">
          {search.offer.trim()}
        </Heading>
      </VStack>
    </Section>
  )
}

export default SearchHeader
