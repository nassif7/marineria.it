import { FC, memo } from 'react'
import { HStack, Text } from '@/components/ui'
import { Clock, Calendar, Euro } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew } from '@/api/types'

const Availability: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation('crew')

  return (
    <Section className="p-0">
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
    </Section>
  )
}

export default memo(Availability)

Availability.displayName = 'Availability'
