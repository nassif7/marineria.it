// components/search/SearchPosition.tsx
import React from 'react'
import { VStack, HStack, Text, Badge, BadgeText } from '@/components/ui'
import { Briefcase, Anchor, CheckCircle, FileText, Clipboard } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SectionHeader, Section, SubSection } from '@/components/appUI'
import { TRecruiterSearch } from '@/api/types/search'

interface SearchPositionProps {
  search: TRecruiterSearch
}

const SearchPosition: React.FC<SearchPositionProps> = ({ search }) => {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeader title={t('position-requirements')} icon={Briefcase} />

      <VStack space="xs">
        {/* Main Position */}
        <SubSection title={t('main-position')} icon={Anchor}>
          <Text size="sm" semiBold shade={800}>
            {search.mainPosition}
          </Text>
        </SubSection>
        {/* Requirements */}
        {search.requirements && (
          <SubSection title={t('requirements')} icon={CheckCircle}>
            <Text size="sm" semiBold shade={800}>
              {search.requirements}
            </Text>
          </SubSection>
        )}

        {/* Description */}
        {search.descriptionOffer && (
          <SubSection icon={FileText} title={t('description')}>
            <Text size="sm" semiBold shade={800}>
              {search.descriptionOffer.replace(/<br\s?\/?>|<\/?b>/g, '')}
            </Text>
          </SubSection>
        )}

        {/* Additional Information */}
        <SubSection icon={Clipboard} title={t('additional-info')}>
          <HStack className="flex-wrap gap-2">
            {search.seamensBook && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeText className="text-typography-800">
                  {t('seamans-book')}: {search.seamensBook}
                </BadgeText>
              </Badge>
            )}
            {search.gender && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeText className="text-typography-800">
                  {t('gender')}: {search.gender}
                </BadgeText>
              </Badge>
            )}

            {search.courses && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeText className="text-typography-800">
                  {t('courses')}: {search.courses}
                </BadgeText>
              </Badge>
            )}

            {search.positionSpecial && (
              <Badge action="muted" variant="outline" className="rounded-md">
                <BadgeText className="text-typography-800">
                  {t('position-specialty')}: {search.positionSpecial}
                </BadgeText>
              </Badge>
            )}
          </HStack>
        </SubSection>
      </VStack>
    </Section>
  )
}

export default SearchPosition
