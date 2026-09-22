import { FC } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/appUI/tokens'
import { GREEN_TEXT } from '../../shared/colors'
import { parseExperience } from '../../helpers'
import StatTile from './StatTile'
import { styles } from './styles'

const StatsStrip: FC<{
  numberClick?: number
  calculatedExperience?: string
  referencesNumber?: number
}> = ({ numberClick, calculatedExperience, referencesNumber }) => {
  const { t } = useTranslation('home-screen')

  return (
    <View style={styles.statsStrip}>
      <StatTile label={t('crew-profile.stat-views')} value={numberClick ?? 0} color={C.ink} />
      <View style={styles.statDivider} />
      <StatTile
        label={t('crew-profile.stat-experience')}
        value={parseExperience(calculatedExperience ?? '', t).value}
        suffix={parseExperience(calculatedExperience ?? '', t).suffix}
        color={C.ink}
      />
      <View style={styles.statDivider} />
      <StatTile label={t('crew-profile.stat-references')} value={referencesNumber ?? 0} color={GREEN_TEXT} />
    </View>
  )
}

export default StatsStrip
