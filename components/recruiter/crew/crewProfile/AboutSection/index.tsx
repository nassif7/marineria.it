import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import HtmlText from '@/components/pro/HtmlText'
import SectionCard from '../shared/SectionCard'
import { styles } from './styles'

const AboutSection: FC<{ curriculum: string }> = ({ curriculum }) => {
  const { t } = useTranslation(['crew'])

  if (!curriculum) return null

  return (
    <SectionCard title={t('about', { ns: 'crew' })}>
      <HtmlText style={styles.aboutText}>{`"${curriculum}"`}</HtmlText>
    </SectionCard>
  )
}

export default AboutSection
