import React from 'react'
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as WebBrowser from 'expo-web-browser'
import { router } from 'expo-router'
import { X, LogIn } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

interface LoginToApplyModalProps {
  visible: boolean
  onClose: () => void
}

const LoginToApplyModal: React.FC<LoginToApplyModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation(['offer-screen', 'login-screen', 'settings-screen'])
  const { bottom } = useSafeAreaInsets()

  const handleLogin = () => {
    onClose()
    router.replace('/sign-in')
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={ms.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[ms.sheet, { paddingBottom: bottom + 20 }]}>
          <View style={ms.header}>
            <Text style={ms.title}>{t('login-to-apply-title', { ns: 'offer-screen' })}</Text>
            <Pressable style={ms.closeBtn} onPress={onClose}>
              <X size={16} color={C.ink2} strokeWidth={2.5} />
            </Pressable>
          </View>

          <Text style={ms.description}>{t('login-to-apply-description', { ns: 'offer-screen' })}</Text>

          <Pressable style={ms.loginBtn} onPress={handleLogin}>
            <LogIn size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={ms.loginBtnText}>{t('login', { ns: 'settings-screen' })}</Text>
          </Pressable>

          <View style={ms.registerRow}>
            <Pressable
              style={ms.registerLink}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')}
            >
              <Text style={ms.registerLinkText}>{t('register-as-crew', { ns: 'login-screen' })}</Text>
            </Pressable>
            <Pressable
              style={ms.registerLink}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}
            >
              <Text style={ms.registerLinkText}>{t('register-as-recruiter', { ns: 'login-screen' })}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const ms = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13,27,42,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  registerLink: {
    paddingVertical: 8,
  },
  registerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.ink3,
    textDecorationLine: 'underline',
  },
})

export default LoginToApplyModal

LoginToApplyModal.displayName = 'LoginToApplyModal'
