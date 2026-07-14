import { FC, memo, useState } from 'react'
import { Modal, View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, User, Unlock, FileText, Send, Check, PhoneCall } from 'lucide-react-native'
import { TCrew } from '@/api/types'
import { useTranslation } from 'react-i18next'
import { getPhotoUrl } from '@/api/consts'
import { useRecruiterSearch } from '@/Providers/RecruiterSearchProvider'
import { C } from '@/components/pro/tokens'
import ContactModalUnpaid from './ContactModalUnpaid'
import { useAuthBrowser } from '@/hooks'

interface IContactModal {
  visible: boolean
  crew: TCrew
  onClose: () => void
  onConfirm: () => void
}

const ContactModal: FC<IContactModal> = ({ visible, crew, onClose, onConfirm }) => {
  const photoUrl = crew.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const { t } = useTranslation(['crew-screen'])
  const { top, bottom } = useSafeAreaInsets()

  const [isConfirmed, setIsConfirmed] = useState(true)
  const [requestPdf, setRequestPdf] = useState(false)

  const benefits = [
    { icon: Unlock, label: t('unlock-contact-information') },
    { icon: FileText, label: t('receive-cv') },
    { icon: Send, label: t('send-job-offer') },
  ]

  const { openUrl, isLoading: isUrlLoading } = useAuthBrowser()

  const {
    search: { data },
  } = useRecruiterSearch()
  const searchLabel = data?.title
  const isPaid = data?.paid

  const onCheckout = () => openUrl('https://www.marineria.it')

  if (!isPaid) {
    return (
      <ContactModalUnpaid visible={visible} onClose={onClose} onCheckout={onCheckout} isUrlLoading={isUrlLoading} />
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[cc.container, { paddingTop: top }]}>
        <View style={cc.header}>
          <Text style={cc.headerTitle}>{t('contact-crew')}</Text>
          <Pressable style={cc.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={cc.avatarWrap}>
            <View style={cc.avatar}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={cc.avatarImg} resizeMode="cover" />
              ) : (
                <User size={24} color={C.orange} strokeWidth={1.8} />
              )}
            </View>
          </View>

          <View style={cc.card}>
            {benefits.map((b, i) => (
              <View key={i} style={[cc.benefitRow, i > 0 && cc.rowBorder]}>
                <View style={cc.benefitIcon}>
                  <b.icon size={15} color={C.orange} strokeWidth={1.8} />
                </View>
                <Text style={cc.benefitLabel}>{b.label}</Text>
                <Check size={15} color="#0F7A28" strokeWidth={2.4} />
              </View>
            ))}
          </View>

          <View style={cc.card}>
            <Pressable style={cc.checkRow} onPress={() => setIsConfirmed((v) => !v)}>
              <View style={[cc.checkbox, isConfirmed && cc.checkboxChecked]}>
                {isConfirmed && <View style={cc.checkmark} />}
              </View>
              <Text style={cc.checkLabel}>
                {crew.mainPosition} · {searchLabel}
              </Text>
            </Pressable>
            <Pressable style={[cc.checkRow, cc.rowBorder]} onPress={() => setRequestPdf((v) => !v)}>
              <View style={[cc.checkbox, requestPdf && cc.checkboxChecked]}>
                {requestPdf && <View style={cc.checkmark} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={cc.checkLabel}>{t('request-cv-as-pdf')}</Text>
                <Text style={cc.checkSub}>{t('longer-time')}</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>

        <View style={[cc.footer, { paddingBottom: bottom + 12 }]}>
          <Pressable style={cc.closeAction} onPress={onClose}>
            <Text style={cc.closeActionText}>{t('close')}</Text>
          </Pressable>
          <Pressable
            style={[cc.contactBtn, !isConfirmed && { opacity: 0.4 }]}
            onPress={onConfirm}
            disabled={!isConfirmed}
          >
            <PhoneCall size={17} color="#FFFFFF" strokeWidth={2} />
            <Text style={cc.contactBtnText}>{t('contact', { ns: 'crew-screen' })}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const cc = StyleSheet.create({
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
  avatarWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: C.orangeSoft,
    borderWidth: 2,
    borderColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  benefitIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  benefitLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.ink4,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  checkmark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
  checkSub: {
    fontSize: 12,
    color: C.ink3,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair,
    flexDirection: 'row',
    gap: 10,
  },
  closeAction: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.hair,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink2,
  },
  contactBtn: {
    flex: 1,
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
  contactBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})

export default memo(ContactModal)

ContactModal.displayName = 'ContactModal'
