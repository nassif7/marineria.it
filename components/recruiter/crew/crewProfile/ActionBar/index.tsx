import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react-native'
import { styles } from './styles'

const ActionBar: FC<{
  isContacted: boolean
  isActionLoading: boolean
  onRemove: () => void
  onContactPress: () => void
}> = ({ isContacted, isActionLoading, onRemove, onContactPress }) => {
  const { t } = useTranslation(['crew-screen'])

  return (
    <View style={styles.actionBar}>
      <Pressable
        style={[styles.smallBtn, styles.removeBtn, isActionLoading && { opacity: 0.5 }]}
        onPress={onRemove}
        disabled={isActionLoading}
      >
        <Trash2 size={18} color="#DC2626" strokeWidth={1.8} />
      </Pressable>
      <Pressable
        style={[styles.contactBtn, isActionLoading && { opacity: 0.6 }]}
        onPress={onContactPress}
        disabled={isActionLoading}
      >
        <Text style={styles.contactBtnText}>
          {isContacted ? t('contact-crew') : t('get-contact', { ns: 'crew-screen' })}
        </Text>
      </Pressable>
    </View>
  )
}

export default ActionBar
