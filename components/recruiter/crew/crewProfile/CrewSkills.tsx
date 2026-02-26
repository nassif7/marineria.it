import { FC } from 'react'
import { Box, Heading, VStack, HStack, Text, Icon } from '@/components/ui'
import { Sparkles, MessageCircle, ClipboardList, Terminal, Zap, Wrench, Code2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { TCrew, TCrewExperience } from '@/api/types'
import { SubSection, Section, SectionHeader, SubSectionHeader } from '@/components/appUI'

const CrewSkill = ({
  label,
  icon,
  value,
  noValueLabel,
}: {
  label: string
  icon: React.ElementType
  value: string
  noValueLabel: string
}) => {
  const { t } = useTranslation()

  return (
    <>
      {value && (
        <SubSection icon={icon} title={label}>
          <Text size="sm" shade={800}>
            {value || t(noValueLabel)}
          </Text>
        </SubSection>
      )}
    </>
  )
}

const CrewSkillsGrid: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation()
  const { professionalSkills, relationalSkills, organizationalSkills, technicalSkills } = crew

  const skills = [
    {
      label: t('soft-skills'),
      value: relationalSkills,
      noValueLabel: 'no-soft-skills',
      icon: MessageCircle,
    },
    {
      label: t('organizational-skills'),
      value: organizationalSkills,
      noValueLabel: 'no-organizational-skills',
      icon: ClipboardList,
    },
    {
      label: t('technical-skills'),
      value: technicalSkills,
      noValueLabel: 'no-technical-skills',
      icon: Code2,
    },
    { label: t('further-abilities'), value: professionalSkills, noValueLabel: 'no-further-abilities', icon: Zap },
  ]

  return (
    <Section>
      <SectionHeader title={t('skills-and-abilities', { ns: 'crew-screen' })} icon={Sparkles} />

      <VStack space="xs">
        {skills.map((skill, index) => (
          <CrewSkill
            key={index}
            label={skill.label}
            value={skill.value}
            noValueLabel={skill.noValueLabel}
            icon={skill.icon}
          />
        ))}
      </VStack>
    </Section>
  )
}

export default CrewSkillsGrid
