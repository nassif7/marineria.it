import { FC } from 'react'
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, Info, Headphones } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'
import { supportTeam } from '@/api'
import ContactSupport from '@/components/common/ContactSupport'

interface IOfferOfflineModal {
  visible: boolean
  onClose: () => void
  showContactSupport?: boolean
}

const OfferOfflineModal: FC<IOfferOfflineModal> = ({ visible, onClose, showContactSupport }) => {
  const { t } = useTranslation('common')
  const { top, bottom } = useSafeAreaInsets()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[oo.container, { paddingTop: top }]}>
        <View style={oo.header}>
          <Text style={oo.headerTitle}>{t('contact-support')}</Text>
          <Pressable style={oo.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={{ padding: 20 }}>
          <View style={oo.infoBox}>
            <Info size={18} color={C.ink3} strokeWidth={1.8} />
            <Text style={oo.infoText}>{t('offer-no-longer-online')}</Text>
          </View>
        </View>

        <View style={[oo.footer, { paddingBottom: bottom + 12 }]}>
          {showContactSupport && (
            <ContactSupport
              title={t('contact-support')}
              supportTeam={supportTeam}
              renderTrigger={({ onPress }) => (
                <Pressable style={oo.contactBtn} onPress={onPress}>
                  <Headphones size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text style={oo.contactBtnText}>{t('contact-support')}</Text>
                </Pressable>
              )}
            />
          )}
          <Pressable style={oo.closeAction} onPress={onClose}>
            <Text style={oo.closeActionText}>{t('close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const oo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.hair2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: C.field,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: C.ink2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair,
    gap: 10,
  },
  contactBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeAction: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})

export default OfferOfflineModal

OfferOfflineModal.displayName = 'OfferOfflineModal'
