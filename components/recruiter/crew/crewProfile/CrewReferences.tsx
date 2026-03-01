import { FC, useState, useMemo } from 'react'
import { TouchableOpacity, Linking } from 'react-native'
import { Box, VStack, HStack, Text, Icon, Divider, Badge, BadgeText } from '@/components/ui'
import { Phone, Mail, Star, ChevronDown, ChevronUp } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew, TCrewReference } from '@/api/types'

const ReferenceItem: FC<{ reference: TCrewReference; index: number }> = ({ reference, index }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      {index > 0 && <Divider />}
      <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.7}>
        <HStack space="sm" className="items-start py-2">
          <VStack className="flex-1" space="xs">
            <Text size="sm" semiBold shade={800}>
              {reference.company_name}
            </Text>
            <Text size="sm">
              {reference.positionreferent} · {reference.yacht}
            </Text>
            <Text size="sm" color="success">
              {reference.yearreference}
            </Text>
          </VStack>
          <Icon as={expanded ? ChevronUp : ChevronDown} size="lg" className="text-typography-400 mt-1" />
        </HStack>
      </TouchableOpacity>

      {expanded && (
        <VStack space="sm" className="mb-2">
          {reference.notes && (
            <Box className="bg-background-50 rounded-lg p-3 border border-outline-100">
              <Text size="sm" className="leading-5 italic" shade={800}>
                "{reference.notes}"
              </Text>
            </Box>
          )}
          <VStack space="xs" className="px-1">
            {reference.email && (
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${reference.email}`)} activeOpacity={0.7}>
                <HStack space="xs" className="items-center">
                  <Icon as={Mail} size="sm" className="text-primary-600" />
                  <Text size="sm" semiBold color="primary">
                    {reference.email}
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
            {reference.telephone && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${reference.telephone}`)} activeOpacity={0.7}>
                <HStack space="xs" className="items-center">
                  <Icon as={Phone} size="sm" className="text-primary-600" />
                  <Text size="sm" semiBold color="primary">
                    {reference.telephone}
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
          </VStack>
        </VStack>
      )}
    </>
  )
}

const ReferencesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])
  const sorted = useMemo(
    () => [...(crew.approvedReferences ?? [])].sort((a, b) => parseInt(b.yearreference) - parseInt(a.yearreference)),
    [crew.approvedReferences]
  )

  return (
    <Section>
      <SectionHeader icon={Star} title={t('references', { ns: 'crew' })} />
      {sorted.length === 0 ? (
        <Badge action="error" variant="outline" className="rounded-md self-start mb-2">
          <BadgeText className="text-error-900">{t('no-references', { ns: 'crew-screen' })}</BadgeText>
        </Badge>
      ) : (
        <SubSection>
          {sorted.map((ref, i) => (
            <ReferenceItem key={ref.idReference} reference={ref} index={i} />
          ))}
        </SubSection>
      )}
    </Section>
  )
}

export default ReferencesSection
