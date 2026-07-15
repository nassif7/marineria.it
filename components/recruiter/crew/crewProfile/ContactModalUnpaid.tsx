import { FC, memo } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, CreditCard, AlertTriangle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

interface IContactModalUnpaid {
  visible: boolean
  onClose: () => void
  onCheckout: () => void
  isUrlLoading?: boolean
}

const WARN_BG = '#FFF7ED'
const WARN_BORDER = '#FDDCB5'
const WARN_TEXT = '#C2600A'

const ContactModalUnpaid: FC<IContactModalUnpaid> = ({ visible, onClose, onCheckout, isUrlLoading }) => {
  const { t } = useTranslation(['crew-screen'])
  const { top, bottom } = useSafeAreaInsets()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[cu.container, { paddingTop: top }]}>
        <View style={cu.header}>
          <Text style={cu.headerTitle}>{t('search-not-paid-title')}</Text>
          <Pressable style={cu.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={cu.warnBox}>
            <AlertTriangle size={18} color={WARN_TEXT} strokeWidth={1.8} />
            <View style={{ flex: 1 }}>
              <Text style={cu.warnText}>{t('search-not-paid-description')}</Text>
              <Text style={cu.warnCta}>{t('search-not-paid-cta')}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[cu.footer, { paddingBottom: bottom + 12 }]}>
          <Pressable
            style={[cu.checkoutBtn, isUrlLoading && { opacity: 0.6 }]}
            onPress={onCheckout}
            disabled={isUrlLoading}
          >
            <CreditCard size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={cu.checkoutBtnText}>{t('proceed-to-checkout')}</Text>
          </Pressable>
          <Pressable style={cu.closeAction} onPress={onClose}>
            <Text style={cu.closeActionText}>{t('close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const cu = StyleSheet.create({
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
  warnBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: WARN_BG,
    borderWidth: 1,
    borderColor: WARN_BORDER,
  },
  warnText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: C.ink,
  },
  warnCta: {
    fontSize: 14,
    fontWeight: '700',
    color: C.orange,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair,
    gap: 10,
  },
  checkoutBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  checkoutBtnText: {
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

export default memo(ContactModalUnpaid)

ContactModalUnpaid.displayName = 'ContactModalUnpaid'
