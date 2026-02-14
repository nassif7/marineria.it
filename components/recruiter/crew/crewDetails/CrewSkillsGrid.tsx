import { FC } from 'react'
import { Box, Heading, VStack, HStack, Text, Icon } from '@/components/ui'
import { Award } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface CrewSkillsGridProps {
  organizationalSkills: string
  relationalSkills: string
  technicalSkills: string
  professionalSkills: string
}

const CrewSkill = ({ label, value, noValueLabel }: { label: string; value: string; noValueLabel: string }) => {
  const { t } = useTranslation()

  return (
    <>
      {value && (
        <VStack className="gap-2">
          <Text className="text-typography-500 text-xs font-medium  tracking-wide">{label}</Text>
          <Box className="bg-background-50 rounded-lg p-3">
            <Text className="text-typography-900 text-sm leading-relaxed break-words">{value || t(noValueLabel)}</Text>
          </Box>
        </VStack>
      )}
    </>
  )
}

const CrewSkillsGrid: FC<CrewSkillsGridProps> = ({
  organizationalSkills,
  relationalSkills,
  technicalSkills,
  professionalSkills,
}) => {
  const { t } = useTranslation()
  const skills = [
    { label: t('crew.further-abilities'), value: professionalSkills, noValueLabel: 'crew.no-further-abilities' },
    {
      label: t('crew.soft-skills'),
      value: relationalSkills,
      noValueLabel: 'crew.no-soft-skills',
    },
    {
      label: t('crew.organizational-skills'),
      value: organizationalSkills,
      noValueLabel: 'crew.no-organizational-skills',
    },
    {
      label: t('crew.technical-skills'),
      value: technicalSkills,
      noValueLabel: 'crew.no-technical-skills',
    },
  ]

  return (
    <Box className="bg-white rounded-2xl p-5  ">
      <HStack className="items-center gap-2 mb-3">
        <Icon as={Award} className="text-primary-600" size="md" />
        <Heading size="md" className="text-primary-600">
          {t('crew.skills-and-abilities')}
        </Heading>
      </HStack>

      <VStack className="gap-3">
        {skills.map((skill, index) => (
          <CrewSkill key={index} label={skill.label} value={skill.value} noValueLabel={skill.noValueLabel} />
        ))}
      </VStack>
    </Box>
  )
}

export default CrewSkillsGrid
