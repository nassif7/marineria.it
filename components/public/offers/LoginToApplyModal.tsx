import React from 'react'
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'
import { router } from 'expo-router'
import { X, LogIn, Anchor, Users } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/appUI/tokens'

interface LoginToApplyModalProps {
  visible: boolean
  onClose: () => void
}

const LoginToApplyModal: React.FC<LoginToApplyModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation(['offer-screen', 'login-screen', 'settings-screen'])
  const { top, bottom } = useSafeAreaInsets()

  const handleLogin = () => {
    onClose()
    router.replace('/sign-in')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[ms.container, { paddingTop: top }]}>
        <View style={ms.header}>
          <Text style={ms.headerTitle}>{t('login-to-apply-title', { ns: 'offer-screen' })}</Text>
          <Pressable style={ms.closeBtn} onPress={onClose}>
            <X size={16} color={C.ink2} strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: bottom + 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={ms.description}>{t('login-to-apply-description', { ns: 'offer-screen' })}</Text>

          <Pressable style={ms.loginBtn} onPress={handleLogin}>
            <LogIn size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={ms.loginBtnText}>{t('login', { ns: 'settings-screen' })}</Text>
          </Pressable>

          <View style={ms.chipRow}>
            <Pressable
              style={ms.chip}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')}
            >
              <Text style={ms.chipLabel}>{t('register-as', { ns: 'login-screen' })}</Text>
              <View style={ms.chipRoleRow}>
                <Anchor size={12} color={C.orange} strokeWidth={2.2} />
                <Text style={ms.chipRoleText}>{t('crew-label', { ns: 'login-screen' })}</Text>
              </View>
            </Pressable>
            <Pressable
              style={ms.chip}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}
            >
              <Text style={ms.chipLabel}>{t('register-as', { ns: 'login-screen' })}</Text>
              <View style={ms.chipRoleRow}>
                <Users size={12} color={C.orange} strokeWidth={2.2} />
                <Text style={ms.chipRoleText}>{t('recruiter-label', { ns: 'login-screen' })}</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
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
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: C.ink3,
    marginBottom: 24,
  },
  loginBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: C.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  chip: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: C.orange,
    borderRadius: 12,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  chipLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: C.orangeText,
    textTransform: 'uppercase',
  },
  chipRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chipRoleText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.orangeText,
  },
})

export default LoginToApplyModal

LoginToApplyModal.displayName = 'LoginToApplyModal'
