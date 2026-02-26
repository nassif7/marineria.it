import { FC, useMemo } from 'react'
import { VStack, HStack, Text, Icon, Badge, BadgeText } from '@/components/ui'
import { User, Briefcase, Anchor, Drama } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
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
        {positions.length && (
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
            {/* <VStack className="pl-2" space="xs">
              {positions.map((p) => (
                <HStack className="items-start" space="xs">
                  <Text size="sm" className="w-32 shrink-0 ">
                    {p.label}:
                  </Text>
                  <Text size="sm" shade={800} className="flex-1">
                    {p.value}
                  </Text>
                </HStack>
              ))}
            </VStack> */}
          </SubSection>
        )}
      </VStack>
    </Section>
  )
}

export default PositionsSection
