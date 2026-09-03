import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Edit2, FileText, Calendar } from 'lucide-react-native'
import Card from '../shared/Card'
import SectionEyebrow from '../shared/SectionEyebrow'
import ActionRow from './ActionRow'

const ProfileActionsSection: FC<{
  missing: number
  coursesCount: number
  dateAvailability?: string
  availabilityLabel: string
  onPreviewPress: () => void
}> = ({ missing, coursesCount, dateAvailability, availabilityLabel, onPreviewPress }) => {
  const { t } = useTranslation('home-screen')

  return (
    <>
      <SectionEyebrow label={t('crew-profile.section-profile')} />
      <Card>
        <ActionRow
          icon={Users}
          title={t('crew-profile.action-preview')}
          sub={t('crew-profile.action-preview-sub')}
          onPress={onPreviewPress}
        />
        <ActionRow
          icon={Edit2}
          title={t('crew-profile.action-edit')}
          sub={t('crew-profile.action-edit-sub', { count: missing })}
          accent
          disabled
        />
        <ActionRow
          icon={FileText}
          title={t('crew-profile.action-docs')}
          sub={t('crew-profile.action-docs-sub', { count: coursesCount })}
          disabled
        />
        <ActionRow
          icon={Calendar}
          title={t('crew-profile.action-availability')}
          sub={
            dateAvailability ? t('crew-profile.action-availability-sub', { date: dateAvailability }) : availabilityLabel
          }
          disabled
          last
        />
      </Card>
    </>
  )
}

export default ProfileActionsSection
