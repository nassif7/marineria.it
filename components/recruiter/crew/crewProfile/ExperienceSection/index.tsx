import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import SectionCard from '../shared/SectionCard'
import EmptyState from '../shared/EmptyState'
import ExperienceItem from './ExperienceItem'
import { TCrewExperience } from '@/api/types'

const ExperienceSection: FC<{ experiences: TCrewExperience[] }> = ({ experiences }) => {
  const { t } = useTranslation(['crew'])

  return (
    <SectionCard title={t('experience', { ns: 'crew' })}>
      {(experiences?.length ?? 0) === 0 ? (
        <EmptyState text={t('no-experience', { ns: 'crew' })} />
      ) : (
        [...experiences]
          .sort((a, b) => {
            const parse = (d: string) => new Date(d?.split('/').reverse().join('-') ?? '').getTime()
            return parse(b.toDate) - parse(a.toDate)
          })
          .map((e, i) => <ExperienceItem key={`${e.idesperienza}-${i}`} exp={e} index={i} />)
      )}
    </SectionCard>
  )
}

export default ExperienceSection
