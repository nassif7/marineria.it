import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { styles } from './styles'

const ActionRow: FC<{
  icon: FC<any>
  title: string
  sub?: string
  accent?: boolean
  last?: boolean
  disabled?: boolean
  onPress?: () => void
}> = ({ icon: Icon, title, sub, accent, last, disabled, onPress }) => {
  const { t } = useTranslation('home-screen')
  return (
    <Pressable
      style={[styles.actionRow, last && styles.actionRowLast, disabled && styles.actionRowDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.actionIcon, accent && !disabled && styles.actionIconAccent]}>
        <Icon size={18} color={disabled ? C.ink4 : accent ? C.orange : C.ink2} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        {sub ? <Text style={styles.actionSub}>{sub}</Text> : null}
      </View>
      {disabled ? (
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>{t('crew-profile.coming-soon')}</Text>
        </View>
      ) : (
        <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
      )}
    </Pressable>
  )
}

export default ActionRow
