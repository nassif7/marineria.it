import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import HtmlText from '@/components/pro/HtmlText'
import SectionCard from '../shared/SectionCard'
import { styles as fieldRowStyles } from '../shared/FieldRow/styles'

const SkillsSection: FC<{
  relationalSkills: string
  organizationalSkills: string
  technicalSkills: string
  professionalSkills: string
}> = ({ relationalSkills, organizationalSkills, technicalSkills, professionalSkills }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  if (!relationalSkills && !organizationalSkills && !technicalSkills && !professionalSkills) return null

  return (
    <SectionCard title={t('skills-and-abilities')}>
      {[
        { label: t('soft-skills', { ns: 'crew' }), value: relationalSkills },
        { label: t('organizational-skills', { ns: 'crew' }), value: organizationalSkills },
        { label: t('technical-skills', { ns: 'crew' }), value: technicalSkills },
        { label: t('further-abilities', { ns: 'crew' }), value: professionalSkills },
      ]
        .filter(({ value }) => !!value)
        .map(({ label, value }) => (
          <View key={label} style={{ marginBottom: 12 }}>
            <Text style={fieldRowStyles.fieldLabel}>{label}</Text>
            <HtmlText style={fieldRowStyles.fieldValue}>{value ?? ''}</HtmlText>
          </View>
        ))}
    </SectionCard>
  )
}

export default SkillsSection
