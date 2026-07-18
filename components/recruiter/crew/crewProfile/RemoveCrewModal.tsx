import { FC, memo } from 'react'
import { Modal, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AlertTriangle, Trash2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

interface IRemoveCrewModal {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

const WARN_BG = '#FFF7ED'
const WARN_TEXT = '#C2600A'

const RemoveCrewModal: FC<IRemoveCrewModal> = ({ visible, onClose, onConfirm, isSubmitting }) => {
  const { t } = useTranslation(['crew-screen', 'common'])
  const { bottom } = useSafeAreaInsets()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={rc.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={isSubmitting ? undefined : onClose} />

        <View style={[rc.card, { marginBottom: Math.max(bottom, 20) }]}>
          <View style={rc.iconCircle}>
            <AlertTriangle size={24} color={WARN_TEXT} strokeWidth={1.8} />
          </View>

          <Text style={rc.title}>{t('remove-crew', { ns: 'crew-screen' })}</Text>
          <Text style={rc.description}>{t('remove-crew-confirm', { ns: 'crew-screen' })}</Text>

          <Pressable
            style={[rc.removeBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Trash2 size={17} color="#FFFFFF" strokeWidth={2} />
                <Text style={rc.removeBtnText}>{t('remove-crew', { ns: 'crew-screen' })}</Text>
              </>
            )}
          </Pressable>
          <Pressable style={rc.cancelBtn} onPress={onClose} disabled={isSubmitting}>
            <Text style={rc.cancelBtnText}>{t('cancel', { ns: 'common' })}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const rc = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13,27,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WARN_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: C.ink2,
    textAlign: 'center',
    marginBottom: 20,
  },
  removeBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  removeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.hair,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink2,
  },
})

export default memo(RemoveCrewModal)

RemoveCrewModal.displayName = 'RemoveCrewModal'
