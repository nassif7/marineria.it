import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Headphones, X } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import ContactSupport from '@/components/common/ContactSupport'
import { supportTeam } from '@/api'
import { styles } from './styles'

const CrewNavBar: FC<{ isModal?: boolean; onBack: () => void; title?: string }> = ({ isModal, onBack, title }) => {
  const { t } = useTranslation(['settings-screen'])
  const insets = useSafeAreaInsets()

  const contactSupportBtn = (
    <ContactSupport
      title={t('contact-support', { ns: 'settings-screen' })}
      supportTeam={supportTeam}
      renderTrigger={({ onPress }) => (
        <Pressable style={styles.iconBtn} onPress={onPress}>
          <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
        </Pressable>
      )}
    />
  )

  // Back navigation always sits on the left; a modal's close (X) always sits on the right —
  // so contact support swaps sides depending on which one this bar is showing.
  const backBtn = (
    <Pressable style={isModal ? styles.closeBtn : styles.iconBtn} onPress={onBack}>
      {isModal ? (
        <X size={16} color={C.ink2} strokeWidth={2.5} />
      ) : (
        <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
      )}
    </Pressable>
  )

  return (
    <View style={[styles.navRow, isModal && { paddingTop: insets.top + 10 }]}>
      {isModal ? contactSupportBtn : backBtn}
      {title ? <Text style={styles.navTitle}>{title}</Text> : null}
      {isModal ? backBtn : contactSupportBtn}
    </View>
  )
}

export default CrewNavBar
