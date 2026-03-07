import { FC } from 'react'
import { Text } from '@/components/ui'
import { User } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew } from '@/api/types'

const AboutSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation()
  return (
    <Section>
      <SectionHeader title={t('about', { ns: 'crew' })} icon={User} />
      <SubSection>
        {crew.curriculum ? (
          <Text size="sm" shade={800}>
            {crew.curriculum}
          </Text>
        ) : (
          <Text size="sm" color="error">
            {t('no-about', { ns: 'crew' })}
          </Text>
        )}
      </SubSection>
    </Section>
  )
}

export default AboutSection

AboutSection.displayName = 'AboutSection'
