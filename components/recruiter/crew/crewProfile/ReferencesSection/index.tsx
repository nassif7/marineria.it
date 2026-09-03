import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import SectionCard from '../shared/SectionCard'
import EmptyState from '../shared/EmptyState'
import ReferenceItem from './ReferenceItem'
import { TCrewReference } from '@/api/types'

const ReferencesSection: FC<{ approvedReferences: TCrewReference[]; isContacted: boolean }> = ({
  approvedReferences,
  isContacted,
}) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  return (
    <SectionCard title={t('references', { ns: 'crew' })}>
      {!approvedReferences?.length ? (
        <EmptyState text={t('no-references')} />
      ) : (
        approvedReferences.map((ref, i) => (
          <ReferenceItem key={ref.idReference} ref={ref} index={i} isContacted={isContacted} />
        ))
      )}
    </SectionCard>
  )
}

export default ReferencesSection
