import { FC, memo } from 'react'
import { Box, Heading, VStack, HStack, Text, Icon, Badge, BadgeText } from '@/lib/components/ui'
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
      {value ? (
        <SubSection icon={icon} title={label}>
          <Text size="sm" shade={800}>
            {value}
          </Text>
        </SubSection>
      ) : (
        <Badge action="error" variant="outline" className="rounded-md self-start">
          <BadgeText className="text-error-900">{t(noValueLabel, { ns: 'crew' })}</BadgeText>
        </Badge>
      )}
    </>
  )
}

const CrewSkillsGrid: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation()
  const { professionalSkills, relationalSkills, organizationalSkills, technicalSkills } = crew

  const skills = [
    {
      label: t('soft-skills', { ns: 'crew' }),
      value: relationalSkills,
      noValueLabel: 'no-soft-skills',
      icon: MessageCircle,
    },
    {
      label: t('organizational-skills', { ns: 'crew' }),
      value: organizationalSkills,
      noValueLabel: 'no-organizational-skills',
      icon: ClipboardList,
    },
    {
      label: t('technical-skills', { ns: 'crew' }),
      value: technicalSkills,
      noValueLabel: 'no-technical-skills',
      icon: Code2,
    },
    {
      label: t('further-abilities', { ns: 'crew' }),
      value: professionalSkills,
      noValueLabel: 'no-further-abilities',
      icon: Zap,
    },
  ]

  return (
    <Section>
      <SectionHeader title={t('skills-and-abilities', { ns: 'crew-screen' })} icon={Sparkles} />
      <VStack space="xs">
        <HStack className="items-start flex-wrap" space="sm">
          {skills.map((skill, index) => !skill.value && <CrewSkill key={index} {...skill} />)}
        </HStack>

        {skills.map(
          (skill, index) =>
            skill.value && (
              <CrewSkill
                key={index}
                label={skill.label}
                value={skill.value}
                noValueLabel={skill.noValueLabel}
                icon={skill.icon}
              />
            )
        )}
      </VStack>
    </Section>
  )
}

export default memo(CrewSkillsGrid)

CrewSkillsGrid.displayName = 'CrewSkillsGrid'
