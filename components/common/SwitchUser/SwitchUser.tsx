import { FC, useState, useRef, useEffect, useMemo } from 'react'
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  Modal,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Text as RNText,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, ButtonText, Text } from '@/components/ui'
import { X, Mail, Eye, EyeOff, Anchor, Users } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import * as WebBrowser from 'expo-web-browser'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { checkEmail } from '@/api/auth'
import { C } from '@/components/pro/tokens'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SwitchUserProps {
  renderTrigger?: (props: { onPress: () => void }) => React.ReactNode
}

const SwitchUser: FC<SwitchUserProps> = ({ renderTrigger }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [method, setMethod] = useState<'otp' | 'password'>('otp')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const { top, bottom } = useSafeAreaInsets()

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height))
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])
  const [codeError, setCodeError] = useState('')
  const prevCodeRef = useRef('')

  const {
    auth: { role },
    switchAuth,
    storedAuthTokens,
    signIn,
    loginWithCode,
  } = useSession()
  const { t } = useTranslation('settings-screen')
  const { t: tLogin } = useTranslation('login-screen')

  const showErrorToast = useAuthErrorToast()
  const activeRole = role as TUserRole
  const proToken = storedAuthTokens[TUserRole.CREW]
  const ownerToken = storedAuthTokens[TUserRole.RECRUITER]
  const targetRole = useMemo(() => (activeRole === TUserRole.CREW ? TUserRole.RECRUITER : TUserRole.CREW), [activeRole])
  const hasBothTokens = proToken && ownerToken

  const handleSwitch = async () => {
    if (hasBothTokens) {
      await switchAuth(targetRole)
      router.replace('/')
    } else {
      setModalVisible(true)
    }
  }

  const handleClose = () => {
    setModalVisible(false)
    setStep('form')
    setMethod('otp')
    setEmail('')
    setEmailError('')
    setPassword('')
    setPasswordError('')
    setCode('')
    setCodeError('')
  }

  const { mutate: handleSignIn, isPending: isSigningIn } = useMutation({
    mutationFn: ({ email: e, password: p }: { email: string; password: string }) => signIn(e, p),
    onSuccess: async () => {
      await switchAuth(targetRole)
      router.replace('/')
    },
    onError: showErrorToast,
    onSettled: () => setModalVisible(false),
  })

  const { mutate: checkEmailMutate, isPending: isCheckingEmail } = useMutation({
    mutationFn: checkEmail,
    onSuccess: (data) => {
      if (data.result === 1) {
        showErrorToast()
        return
      }
      setStep('code')
    },
    onError: () => showErrorToast(),
  })

  const { mutate: loginWithCodeMutate, isPending: isLoggingInWithCode } = useMutation({
    mutationFn: async (codeArg: string) => {
      await loginWithCode(email, codeArg)
    },
    onSuccess: async () => {
      await switchAuth(targetRole)
      router.replace('/')
    },
    onError: () => showErrorToast(),
    onSettled: () => setModalVisible(false),
  })

  const handleSendCode = () => {
    const trimmed = email.trim()
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError(tLogin('invalid-email'))
      return
    }
    checkEmailMutate(trimmed)
  }

  const handlePasswordLogin = () => {
    let hasError = false
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError(tLogin('invalid-email'))
      hasError = true
    }
    if (!password.trim()) {
      setPasswordError(tLogin('invalid-password'))
      hasError = true
    }
    if (hasError) return
    handleSignIn({ email: email.trim(), password: password.trim() })
  }

  const switchMethod = (next: 'otp' | 'password') => {
    setMethod(next)
    setEmailError('')
    setPasswordError('')
  }

  const handleCodeChange = (value: string) => {
    setCode(value)
    if (codeError) setCodeError('')
    const trimmed = value.trim()
    const isPaste = trimmed.length - prevCodeRef.current.trim().length > 1
    prevCodeRef.current = value
    if (isPaste || trimmed.length >= 6) {
      loginWithCodeMutate(trimmed)
    }
  }

  const label = hasBothTokens
    ? activeRole === TUserRole.CREW
      ? t('switch-to-recruiter')
      : t('switch-to-crew')
    : role === TUserRole.CREW
      ? t('login-as-recruiter')
      : t('login-as-crew')

  const isBusy = isSigningIn || isCheckingEmail

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ onPress: handleSwitch })
      ) : (
        <Button onPress={handleSwitch}>
          <ButtonText className="text-white">{label}</ButtonText>
        </Button>
      )}

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={[su.container, { paddingTop: top, paddingBottom: keyboardHeight }]}>
          <View style={su.header}>
            <Text style={su.headerTitle}>{label}</Text>
            <Pressable style={su.closeBtn} onPress={handleClose}>
              <X size={16} color={C.ink2} strokeWidth={2.5} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
            contentContainerStyle={{ padding: 20, paddingBottom: bottom + 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'form' ? (
              <>
                <RNText style={su.subtitle}>
                  {method === 'otp' ? tLogin('otp-description') : tLogin('password-description')}
                </RNText>

                <View style={su.methodTrack}>
                  <Pressable
                    style={[su.methodTab, method === 'otp' && su.methodTabActive]}
                    onPress={() => switchMethod('otp')}
                  >
                    <RNText style={[su.methodTabText, method === 'otp' && su.methodTabTextActive]}>
                      {tLogin('otp-tab')}
                    </RNText>
                  </Pressable>
                  <Pressable
                    style={[su.methodTab, method === 'password' && su.methodTabActive]}
                    onPress={() => switchMethod('password')}
                  >
                    <RNText style={[su.methodTabText, method === 'password' && su.methodTabTextActive]}>
                      {tLogin('password-tab')}
                    </RNText>
                  </Pressable>
                </View>

                <View style={[su.field, !!emailError && su.fieldError]}>
                  <Mail size={17} color={C.ink4} strokeWidth={1.8} />
                  <TextInput
                    style={su.fieldInput}
                    placeholder={tLogin('email')}
                    placeholderTextColor={C.ink4}
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v)
                      if (emailError) setEmailError('')
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>
                {!!emailError && <RNText style={su.errorText}>{emailError}</RNText>}

                {method === 'password' && (
                  <>
                    <View style={[su.field, su.fieldSpaced, !!passwordError && su.fieldError]}>
                      <TextInput
                        style={su.fieldInput}
                        placeholder={tLogin('password')}
                        placeholderTextColor={C.ink4}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(v) => {
                          setPassword(v)
                          if (passwordError) setPasswordError('')
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <Pressable hitSlop={8} onPress={() => setShowPassword((v) => !v)}>
                        {showPassword ? (
                          <EyeOff size={18} color={C.ink4} strokeWidth={1.8} />
                        ) : (
                          <Eye size={18} color={C.ink4} strokeWidth={1.8} />
                        )}
                      </Pressable>
                    </View>
                    {!!passwordError && <RNText style={su.errorText}>{passwordError}</RNText>}
                  </>
                )}

                <Pressable
                  style={[su.primaryBtn, isBusy && su.primaryBtnDisabled]}
                  onPress={method === 'otp' ? handleSendCode : handlePasswordLogin}
                  disabled={isBusy}
                >
                  {isBusy ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <RNText style={su.primaryBtnText}>
                      {method === 'otp' ? tLogin('send-code') : tLogin('login')}
                    </RNText>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <RNText style={su.subtitle}>{tLogin('code-sent', { email })}</RNText>

                <View style={[su.field, !!codeError && su.fieldError]}>
                  <TextInput
                    style={su.fieldInput}
                    placeholder={tLogin('code-placeholder')}
                    placeholderTextColor={C.ink4}
                    value={code}
                    onChangeText={handleCodeChange}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>
                {!!codeError && <RNText style={su.errorText}>{codeError}</RNText>}

                <Pressable
                  style={[su.primaryBtn, su.fieldSpaced, isLoggingInWithCode && su.primaryBtnDisabled]}
                  onPress={() => {
                    if (!code.trim()) {
                      setCodeError(tLogin('enter-code'))
                      return
                    }
                    loginWithCodeMutate(code.trim())
                  }}
                  disabled={isLoggingInWithCode}
                >
                  {isLoggingInWithCode ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <RNText style={su.primaryBtnText}>{tLogin('login')}</RNText>
                  )}
                </Pressable>

                <Pressable style={su.textLink} onPress={() => setStep('form')}>
                  <RNText style={su.textLinkText}>{t('common:back')}</RNText>
                </Pressable>
              </>
            )}

            <View style={su.dividerRow}>
              <View style={su.dividerLine} />
              <RNText style={su.dividerLabel}>{tLogin('or').toUpperCase()}</RNText>
              <View style={su.dividerLine} />
            </View>

            {activeRole !== TUserRole.RECRUITER && (
              <Pressable
                style={su.chip}
                onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}
              >
                <Users size={13} color={C.orange} strokeWidth={2.2} />
                <RNText style={su.chipText}>{tLogin('register-as-recruiter')}</RNText>
              </Pressable>
            )}
            {activeRole !== TUserRole.CREW && (
              <Pressable
                style={[su.chip, su.chipSpaced]}
                onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')}
              >
                <Anchor size={13} color={C.orange} strokeWidth={2.2} />
                <RNText style={su.chipText}>{tLogin('register-as-crew')}</RNText>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

const su = StyleSheet.create({
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
  subtitle: {
    fontSize: 13.5,
    color: C.ink3,
    lineHeight: 19,
    marginBottom: 16,
  },
  methodTrack: {
    flexDirection: 'row',
    backgroundColor: C.field,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  methodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  methodTabTextActive: {
    color: C.ink,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.hair,
    backgroundColor: '#FFFFFF',
  },
  fieldSpaced: {
    marginTop: 10,
  },
  fieldError: {
    borderColor: '#DC2626',
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: C.ink,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
    marginTop: 6,
    marginLeft: 2,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  textLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.hair,
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderWidth: 1.5,
    borderColor: C.orange,
    borderRadius: 12,
    backgroundColor: C.orangeSoft,
  },
  chipSpaced: {
    marginTop: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.orangeText,
  },
})

export default SwitchUser

SwitchUser.displayName = 'SwitchUser'
