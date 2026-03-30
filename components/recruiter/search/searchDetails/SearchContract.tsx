import React from 'react'
import { Box, VStack, HStack, Text, Icon, Divider, Pressable } from '@/lib/components/ui'
import { FileText, Calendar, Euro, MapPin, Info } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SectionHeader, Section, SubSection } from '@/components/appUI'
import { TRecruiterSearch } from '@/api/types'
import { Linking } from 'react-native'
import { isDateString } from '@/lib/utils/dateUtils'

interface SearchContractProps {
  search: TRecruiterSearch
}

const SearchContract: React.FC<SearchContractProps> = ({ search }) => {
  const { t } = useTranslation()
  const hasLocation = search.positionArm || (search.latArm !== 0 && search.lngArm !== 0)

  const handleOpenMap = () => {
    if (search.latArm && search.lngArm && search.latArm !== 0 && search.lngArm !== 0) {
      const url = `https://www.google.com/maps/search/?api=1&query=${search.latArm},${search.lngArm}`
      Linking.openURL(url)
    }
  }

  return (
    <Section>
      <SectionHeader title={t('contract-and-compensation', { ns: 'search-screen' })} icon={FileText} />
      <VStack space="xs">
        <SubSection title={t('contract-type')}>
          <Text size="sm" semiBold shade={800}>
            {search.contractDescription}
          </Text>
        </SubSection>
        <HStack space="xs">
          <SubSection className="flex-1" title={t('salary')} icon={Euro}>
            <Text size="sm" semiBold shade={800}>
              {search.salary_From} - {search.salary_To}
            </Text>
          </SubSection>

          {hasLocation && (
            <SubSection className="flex-1 " title={t('location')} icon={MapPin}>
              <Pressable onPress={handleOpenMap}>
                <Text color="primary" size="sm" semiBold>
                  {search.positionArm}
                </Text>
              </Pressable>
            </SubSection>
          )}
        </HStack>

        <SubSection icon={Calendar} title={t('period')}>
          <Text size="sm" semiBold shade={800}>
            {isDateString(search.boarding) ? `${t('from')}:` : ''}
            {search.boarding}
          </Text>
          <Text size="sm" semiBold shade={800}>
            {isDateString(search.duration) ? `${t('to')}:` : ''}
            {search.duration}
          </Text>
        </SubSection>
      </VStack>
    </Section>
  )
}

export default SearchContract
