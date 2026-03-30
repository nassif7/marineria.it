import { FC, memo, useMemo } from 'react'
import { VStack, HStack, Text, Icon, Badge, BadgeText } from '@/lib/components/ui'
import { User, Briefcase, Anchor, Drama } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/lib/components'

import { TCrew } from '@/api/types'

const PositionsSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])
  const positions = useMemo(
    () =>
      [
        { label: 'Deck', value: crew.pos_deck },
        { label: 'Engine', value: crew.pos_engine },
        { label: 'Harbour', value: crew.pos_harbour },
        { label: 'Hotel', value: crew.pos_hotel },
        { label: 'Special', value: crew.pos_special },
      ].filter((p) => p.value),
    [crew]
  )

  return (
    <Section>
      <SectionHeader title={t('roles-and-positions')} icon={User} />
      <VStack space="xs">
        <SubSection title={t('main-position')} icon={Briefcase}>
          <Text size="sm" semiBold shade={800}>
            {crew.mainPosition}
          </Text>
          {crew.specseling && (
            <HStack space="xs" className="items-center mt-2">
              <Icon as={Anchor} size="sm" className="text-typography-600" />
              <Text size="sm" semiBold shade={600}>
                {crew.specseling}
              </Text>
            </HStack>
          )}
        </SubSection>
        {!!positions.length && (
          <SubSection title={t('other-roles')} icon={Drama}>
            <HStack className="flex-wrap " space="xs">
              {positions.map((p) => (
                <Badge key={p.label} action="muted" variant="outline" className="rounded-md">
                  <BadgeText className="text-typography-800">
                    {p.label}: {p.value}
                  </BadgeText>
                </Badge>
              ))}
            </HStack>
          </SubSection>
        )}
      </VStack>
    </Section>
  )
}

export default memo(PositionsSection)

PositionsSection.displayName = 'PositionsSection'
