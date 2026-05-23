import React from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'
import { useAuthBrowser } from '@/hooks'
import { useUser } from '@/Providers/UserProvider'

interface NotApplicableModalProps {
  visible: boolean
  onClose: () => void
  reasons: string[]
}

const NotApplicableModal: React.FC<NotApplicableModalProps> = ({ visible, onClose, reasons }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'common'])
  const { top, bottom } = useSafeAreaInsets()
  const { user } = useUser()
  const { openUrl } = useAuthBrowser()
  const handleReviewProfile = () => openUrl(`https://www.marineria.it/${language}/CV.aspx?idutente=${user?.iduser}`)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[ms.container, { paddingTop: top }]}>
        <View style={ms.header}>
          <Text style={ms.title}>{t('not-matching-title', { ns: 'offer-screen' })}</Text>
          <Pressable style={ms.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView style={ms.body} contentContainerStyle={ms.bodyContent} showsVerticalScrollIndicator={false}>
          {reasons.length > 0 ? (
            reasons.map((reason, index) => (
              <View key={index} style={ms.reasonRow}>
                <View style={ms.reasonNumber}>
                  <Text style={ms.reasonNumberText}>{index + 1}</Text>
                </View>
                <Text style={ms.reasonText}>{reason}</Text>
              </View>
            ))
          ) : (
            <Text style={ms.emptyText}>{t('not-matching-no-reasons', { ns: 'offer-screen' })}</Text>
          )}
        </ScrollView>

        <View style={[ms.footer, { paddingBottom: bottom + 12 }]}>
          <Pressable style={ms.profileBtn} onPress={handleReviewProfile}>
            <Text style={ms.profileBtnText}>{t('review-your-profile', { ns: 'offer-screen' })}</Text>
          </Pressable>
          <Pressable style={ms.closeAction} onPress={onClose}>
            <Text style={ms.closeActionText}>{t('close', { ns: 'common' })}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const ms = StyleSheet.create({
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
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.hair2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 14,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  reasonNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  reasonNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.orange,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: C.ink2,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
    color: C.ink3,
    textAlign: 'center',
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair,
    gap: 10,
  },
  profileBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
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

export default NotApplicableModal
