import React, { useState } from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, Send, UserRound } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'
import PublicPreviewModal from '@/components/crew/profile/PublicPreviewModal'

interface ApplyModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, onConfirm, isSubmitting }) => {
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const { t } = useTranslation(['offer-screen', 'common'])
  const { top, bottom } = useSafeAreaInsets()

  const handleReviewProfile = () => setPreviewVisible(true)

  const handleApply = () => {
    if (consentAccepted) {
      onConfirm()
      setConsentAccepted(false)
    }
  }

  const handleClose = () => {
    setConsentAccepted(false)
    onClose()
  }

  const complianceItems = [
    t('agree-to-policy', { ns: 'offer-screen' }),
    t('confirm-availability', { ns: 'offer-screen' }),
    t('confirm-requirements', { ns: 'offer-screen' }),
  ]

  return (
    <>
      <Modal visible={visible && !previewVisible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={[ms.container, { paddingTop: top }]}>
          {/* Header */}
          <View style={ms.header}>
            <Text style={ms.title}>{t('confirm-application', { ns: 'offer-screen' })}</Text>
            <Pressable style={ms.closeBtn} onPress={handleClose}>
              <X size={16} color={C.ink2} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Body */}
          <ScrollView style={ms.body} contentContainerStyle={ms.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={ms.content}>
              <Text style={ms.sectionLabel}>{t('privacy', { ns: 'offer-screen' })}</Text>
              <Text style={ms.bodyText}>{t('privacy-policy', { ns: 'offer-screen' })}</Text>

              <View style={ms.divider} />

              <Text style={ms.sectionLabel}>{t('compliance', { ns: 'offer-screen' })}</Text>
              {complianceItems.map((item, i) => (
                <View key={i} style={ms.itemRow}>
                  <View style={ms.badge}>
                    <Text style={ms.badgeText}>–</Text>
                  </View>
                  <Text style={ms.itemText}>{item}</Text>
                </View>
              ))}

              <View style={ms.divider} />

              <Pressable style={ms.checkRow} onPress={() => setConsentAccepted((v) => !v)}>
                <View style={[ms.checkbox, consentAccepted && ms.checkboxChecked]}>
                  {consentAccepted && <View style={ms.checkmark} />}
                </View>
                <Text style={ms.checkLabel}>{t('agree', { ns: 'offer-screen' })}</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Footer — morphs after agreement */}
          <View style={[ms.footer, { paddingBottom: bottom + 12 }]}>
            {consentAccepted ? (
              <View style={ms.actionRow}>
                <Pressable style={ms.iconBtn} onPress={handleClose}>
                  <X size={18} color="#FFFFFF" strokeWidth={2.2} />
                </Pressable>
                <Pressable style={ms.profileIconBtn} onPress={handleReviewProfile}>
                  <UserRound size={18} color="#FFFFFF" strokeWidth={2.2} />
                </Pressable>
                <Pressable style={ms.applyBtn} onPress={handleApply} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Send size={17} color="#FFFFFF" strokeWidth={2} />
                      <Text style={ms.applyText}>{t('apply-for-this-position', { ns: 'offer-screen' })}</Text>
                    </>
                  )}
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable style={ms.profileBtn} onPress={handleReviewProfile}>
                  <Text style={ms.profileBtnText}>{t('review-your-profile', { ns: 'offer-screen' })}</Text>
                </Pressable>
                <View style={ms.actionRow}>
                  <Pressable style={ms.cancelBtn} onPress={handleClose}>
                    <Text style={ms.cancelText}>{t('cancel', { ns: 'common' })}</Text>
                  </Pressable>
                  <Pressable style={[ms.applyBtn, ms.applyBtnDisabled]} disabled>
                    <Text style={ms.applyText}>{t('apply', { ns: 'offer-screen' })}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <PublicPreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} />
    </>
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
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
  },
  content: {
    gap: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: C.ink3,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 23,
    color: C.ink2,
  },
  divider: {
    height: 1,
    backgroundColor: C.hair,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.orange,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: C.ink2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applyBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyBtnDisabled: {
    opacity: 0.35,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})

export default ApplyModal

ApplyModal.displayName = 'ApplyModal'
