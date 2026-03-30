import { FC, memo } from 'react'
import { HStack, Text, Icon, VStack } from '@/lib/components/ui'
import { Clock, Calendar, IdCard, Heart } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew } from '@/api/types'

const Availability: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation('crew')

  return (
    <Section>
      <VStack space="xs">
        <HStack space="xs">
          <SubSection title={t('available-from', { ns: 'crew' })} icon={Calendar} className="flex-1">
            <Text size="sm" semiBold shade={800}>
              {crew.dateAvailability || '—'}
            </Text>
          </SubSection>
          <SubSection title={t('last-seen', { ns: 'crew' })} icon={Clock} className="flex-1">
            <Text size="sm" semiBold shade={800}>
              {crew.lastAccessDate}
            </Text>
          </SubSection>
        </HStack>
        <SubSection>
          <HStack className="items-start" space="xs">
            <HStack space="xs" className="items-center w-32 shrink-0">
              <Icon as={IdCard} size="sm" className="text-typography-600" />
              <Text size="sm">{t('salary')}:</Text>
            </HStack>
            <Text size="sm" semiBold>
              {crew.salary || '—'}
            </Text>
          </HStack>
          <HStack className="items-start" space="xs">
            <HStack space="xs" className="items-center w-32 shrink-0">
              <Icon as={Heart} size="sm" className="text-typography-600" />
              <Text size="sm">{t('in-team-with', { ns: 'crew' })}:</Text>
            </HStack>
            <Text size="sm" semiBold>
              {crew.card1Couple || '—'}
            </Text>
          </HStack>
        </SubSection>
      </VStack>
    </Section>
  )
}

export default memo(Availability)

Availability.displayName = 'Availability'
