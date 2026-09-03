import { FC } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/appUI/tokens'
import SectionCard from '../shared/SectionCard'
import FieldRow from '../shared/FieldRow'
import { styles as fieldRowStyles } from '../shared/FieldRow/styles'
import { pillStyles } from '../shared/pillStyles'
import { ORANGE_TEXT } from '../shared/colors'

const LanguagesEducationSection: FC<{
  languages: string[]
  educationalLevel: string
  coursesList: string[]
}> = ({ languages, educationalLevel, coursesList }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  if (languages.length === 0 && !educationalLevel && coursesList.length === 0) return null

  return (
    <SectionCard title={t('languages-and-education')}>
      {languages.length > 0 && (
        <>
          <Text style={fieldRowStyles.fieldLabel}>{t('languages', { ns: 'crew' })}</Text>
          <View style={pillStyles.tagsRow}>
            {languages.map((l, i) => (
              <View key={`${l}-${i}`} style={[pillStyles.pill, pillStyles.pillNeutral]}>
                <Text style={[pillStyles.pillText, { color: C.ink2 }]}>{l}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      {educationalLevel ? <FieldRow label={t('education', { ns: 'crew' })} value={educationalLevel} /> : null}
      {coursesList.length > 0 && (
        <>
          <Text style={fieldRowStyles.fieldLabel}>{t('corses-and-certificates')}</Text>
          <View style={pillStyles.tagsRow}>
            {coursesList.map((c, i) => (
              <View key={`${c}-${i}`} style={pillStyles.pillOrange}>
                <Text style={[pillStyles.pillText, { color: ORANGE_TEXT }]}>{c}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </SectionCard>
  )
}

export default LanguagesEducationSection
