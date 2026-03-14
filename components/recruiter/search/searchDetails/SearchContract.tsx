import React from 'react'
import { Box, VStack, HStack, Text, Icon, Divider, Pressable } from '@/components/ui'
import { FileText, Calendar, Euro, MapPin, Info } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SectionHeader, Section, SubSection } from '@/components/appUI'
import { TRecruiterSearch } from '@/api/types'
import { Linking } from 'react-native'
import { isDateString } from '@/utils'

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

        <Divider className="my-2" />
        <VStack className="pl-2">
          <HStack className="items-start gap-1">
            <Box className="w-32 shrink-0 flex-row items-center gap-1">
              <Icon as={Info} size="sm" className="text-warning-600" />
              <Text size="sm" color="error" bold>
                {t('expires')}:
              </Text>
            </Box>
            <Text size="sm" color="error" bold className="flex-1">
              {search.offertExpirationdate}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Section>
  )
}

export default SearchContract
