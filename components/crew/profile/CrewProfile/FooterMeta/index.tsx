import { FC } from 'react'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../helpers'
import { styles } from './styles'

const FooterMeta: FC<{ registrationDate?: string; lastAccessDate?: string }> = ({
  registrationDate,
  lastAccessDate,
}) => {
  const { t } = useTranslation('home-screen')

  if (!registrationDate && !lastAccessDate) return null

  return (
    <Text style={styles.footerMeta}>
      {[
        registrationDate && t('crew-profile.registered-on', { date: formatDate(registrationDate) }),
        lastAccessDate && t('crew-profile.last-access', { date: formatDate(lastAccessDate) }),
      ]
        .filter(Boolean)
        .join(' · ')}
    </Text>
  )
}

export default FooterMeta
