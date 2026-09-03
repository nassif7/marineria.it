import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import SectionCard from '../shared/SectionCard'
import ContactInfoRow from './ContactInfoRow'

type TContactEntry = { icon: FC<any>; label: string; value: string; onPress: () => void }

const ContactInfoSection: FC<{ entries: TContactEntry[] }> = ({ entries }) => {
  const { t } = useTranslation(['crew'])

  return (
    <SectionCard title={t('contact-information', { ns: 'crew' })}>
      {entries.map((entry, i) => (
        <ContactInfoRow
          key={entry.label}
          icon={entry.icon}
          label={entry.label}
          value={entry.value}
          onPress={entry.onPress}
          last={i === entries.length - 1}
        />
      ))}
    </SectionCard>
  )
}

export default ContactInfoSection
