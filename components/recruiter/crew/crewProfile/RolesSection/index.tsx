import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'
import SectionCard from '../shared/SectionCard'
import FieldRow from '../shared/FieldRow'
import { styles as fieldRowStyles } from '../shared/FieldRow/styles'
import { pillStyles } from '../shared/pillStyles'

const RolesSection: FC<{ mainPosition: string; specseling: string; otherPositions: string[] }> = ({
  mainPosition,
  specseling,
  otherPositions,
}) => {
  const { t } = useTranslation(['crew-screen', 'offer'])

  return (
    <SectionCard title={t('roles-and-positions')}>
      <FieldRow label={t('main-position', { ns: 'offer' })} value={mainPosition} bold />
      {specseling ? <FieldRow label={t('position-specialty', { ns: 'offer' })} value={specseling} /> : null}
      {otherPositions.length > 0 && (
        <>
          <Text style={fieldRowStyles.fieldLabel}>{t('other-roles')}</Text>
          <View style={pillStyles.tagsRow}>
            {otherPositions.map((p) => (
              <View key={p} style={[pillStyles.pill, pillStyles.pillNeutral]}>
                <Text style={[pillStyles.pillText, { color: C.ink2 }]}>{p}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </SectionCard>
  )
}

export default RolesSection
