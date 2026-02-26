import { FC, useState, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, VStack, HStack, Text, Icon, Divider } from '@/components/ui'
import { Briefcase, ChevronDown, ChevronUp, Compass } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew, TCrewExperience } from '@/api/types'

const ExperienceItem: FC<{ exp: TCrewExperience; index: number }> = ({ exp, index }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {index > 0 && <Divider className="bg-outline-100" />}
      <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.7}>
        <HStack space="sm" className="items-start py-2">
          <VStack className="flex-1" space="xs">
            <Text size="sm" semiBold shade={800}>
              {exp.typeofemployment}
            </Text>
            <Text size="sm">
              {exp.boatcompany} · {exp.employer}
            </Text>
            <Text size="sm" color="success">
              {exp.fromDate} - {exp.toDate}
            </Text>
          </VStack>
          <Icon as={expanded ? ChevronUp : ChevronDown} size="lg" className="text-typography-400 mt-1" />
        </HStack>
      </TouchableOpacity>
      {expanded && (
        <Box className="bg-white rounded-lg p-3 mb-2 border border-outline-100">
          <Text size="sm" className="leading-5">
            {exp.typeofassignment}
          </Text>
        </Box>
      )}
    </>
  )
}

const ExperiencesSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  const sorted = useMemo(
    () =>
      [...(crew.experiences ?? [])].sort(
        (a, b) =>
          new Date(b.toDate.split('/').reverse().join('-')).getTime() -
          new Date(a.toDate.split('/').reverse().join('-')).getTime()
      ),
    [crew.experiences]
  )

  return (
    <Section>
      <SectionHeader icon={Compass} title={t('experience', { ns: 'crew' })} />
      <HStack className="items-center justify-between mb-2">
        <Text size="sm" bold className="text-typography-800">
          {crew.calculatedExperience?.trim()} - {crew.navigationBook}
        </Text>
      </HStack>

      {crew.experiences.length === 0 ? (
        <Text size="sm">{t('no-experience', { ns: 'crew-screen' })}</Text>
      ) : (
        <SubSection>
          {sorted.map((exp, i) => (
            <ExperienceItem key={exp.idesperienza} exp={exp} index={i} />
          ))}
        </SubSection>
      )}
    </Section>
  )
}

export default ExperiencesSection
