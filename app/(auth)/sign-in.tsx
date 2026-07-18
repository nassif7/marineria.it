import { useState, useRef } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { View, Pressable, StyleSheet, TextInput, Text as RNText, ActivityIndicator } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Mail, Anchor, Users, Eye, EyeOff, ArrowRight } from 'lucide-react-native'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { AuthScreen } from '@/components/appUI'
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonText,
  Heading,
  Text,
} from '@/components/ui'
import { checkEmail } from '@/api/auth'
import { useSession } from '@/Providers/SessionProvider/SessionProvider'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignIn = () => {
  const { t } = useTranslation('login-screen')
  const showErrorToast = useAuthErrorToast()
  const { loginWithCode, signIn, continueAsGuest } = useSession()

  const [method, setMethod] = useState<'otp' | 'password'>('otp')
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false)

  const { mutate: checkEmailMutate, isPending: isCheckingEmail } = useMutation({
    mutationFn: checkEmail,
    onSuccess: (data) => {
      if (data.result === 1) {
        setShowNoAccountDialog(true)
        return
      }
      setStep('code')
    },
    onError: () => showErrorToast(),
  })

  const { mutate: loginMutate, isPending: isLoggingIn } = useMutation({
    mutationFn: async (codeArg: string) => {
      await loginWithCode(email, codeArg)
    },
    onSuccess: () => router.replace('/'),
    onError: () => showErrorToast(),
  })

  const { mutate: passwordLoginMutate, isPending: isPasswordLoggingIn } = useMutation({
    mutationFn: ({ email: e, password: p }: { email: string; password: string }) => signIn(e, p),
    onSuccess: () => router.replace('/'),
    onError: () => showErrorToast(),
  })

  const prevCodeRef = useRef('')

  const handleCodeChange = (value: string) => {
    setCode(value)
    if (codeError) setCodeError('')
    const trimmed = value.trim()
    const isPaste = trimmed.length - prevCodeRef.current.trim().length > 1
    prevCodeRef.current = value
    if (isPaste || trimmed.length >= 6) {
      loginMutate(trimmed)
    }
  }

  const handleSendCode = () => {
    const trimmed = email.trim()
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError(t('invalid-email'))
      return
    }
    checkEmailMutate(trimmed)
  }

  const handlePasswordLogin = () => {
    let hasError = false
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError(t('invalid-email'))
      hasError = true
    }
    if (!password.trim()) {
      setPasswordError(t('invalid-password'))
      hasError = true
    }
    if (hasError) return
    passwordLoginMutate({ email: email.trim(), password: password.trim() })
  }

  const switchMethod = (next: 'otp' | 'password') => {
    setMethod(next)
    setEmailError('')
    setPasswordError('')
  }

  return (
    <AuthScreen>
      {step === 'form' && (
        <>
          <RNText style={styles.sheetTitle}>{t('sheet-title')}</RNText>
          <RNText style={styles.sheetSubtitle}>
            {method === 'otp' ? t('otp-description') : t('password-description')}
          </RNText>

          {/* Method switch */}
          <View style={styles.methodTrack}>
            <Pressable
              style={[styles.methodTab, method === 'otp' && styles.methodTabActive]}
              onPress={() => switchMethod('otp')}
            >
              <RNText style={[styles.methodTabText, method === 'otp' && styles.methodTabTextActive]}>
                {t('otp-tab')}
              </RNText>
            </Pressable>
            <Pressable
              style={[styles.methodTab, method === 'password' && styles.methodTabActive]}
              onPress={() => switchMethod('password')}
            >
              <RNText style={[styles.methodTabText, method === 'password' && styles.methodTabTextActive]}>
                {t('password-tab')}
              </RNText>
            </Pressable>
          </View>

          <View style={[styles.field, !!emailError && styles.fieldError]}>
            <Mail size={17} color={C.ink4} strokeWidth={1.8} />
            <TextInput
              style={styles.fieldInput}
              placeholder={t('email')}
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
          {!!emailError && <RNText style={styles.errorText}>{emailError}</RNText>}

          {method === 'password' && (
            <>
              <View style={[styles.field, styles.fieldSpaced, !!passwordError && styles.fieldError]}>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={t('password')}
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
              {!!passwordError && <RNText style={styles.errorText}>{passwordError}</RNText>}
            </>
          )}

          <Pressable
            style={[styles.primaryBtn, (isCheckingEmail || isPasswordLoggingIn) && styles.primaryBtnDisabled]}
            onPress={method === 'otp' ? handleSendCode : handlePasswordLogin}
            disabled={isCheckingEmail || isPasswordLoggingIn}
          >
            {isCheckingEmail || isPasswordLoggingIn ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <RNText style={styles.primaryBtnText}>{method === 'otp' ? t('send-code') : t('login')}</RNText>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <RNText style={styles.dividerLabel}>{t('or').toUpperCase()}</RNText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.chipRow}>
            <Pressable
              style={styles.chip}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')}
            >
              <RNText style={styles.chipLabel}>{t('register-as')}</RNText>
              <View style={styles.chipRoleRow}>
                <Anchor size={12} color={C.orange} strokeWidth={2.2} />
                <RNText style={styles.chipRoleText}>{t('crew-label')}</RNText>
              </View>
            </Pressable>
            <Pressable
              style={styles.chip}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}
            >
              <RNText style={styles.chipLabel}>{t('register-as')}</RNText>
              <View style={styles.chipRoleRow}>
                <Users size={12} color={C.orange} strokeWidth={2.2} />
                <RNText style={styles.chipRoleText}>{t('recruiter-label')}</RNText>
              </View>
            </Pressable>
          </View>

          <Pressable
            style={styles.skipBtn}
            onPress={() => {
              continueAsGuest()
              router.replace('/')
            }}
          >
            <RNText style={styles.skipText}>{t('continue-without-login')}</RNText>
            <ArrowRight size={14} color={C.ink3} strokeWidth={2.2} />
          </Pressable>
        </>
      )}

      {step === 'code' && (
        <>
          <RNText style={styles.sheetTitle}>{t('sheet-title')}</RNText>
          <RNText style={styles.sheetSubtitle}>{t('code-sent', { email })}</RNText>

          <View style={[styles.field, !!codeError && styles.fieldError]}>
            <TextInput
              style={styles.fieldInput}
              placeholder={t('code-placeholder')}
              placeholderTextColor={C.ink4}
              value={code}
              onChangeText={handleCodeChange}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
          {!!codeError && <RNText style={styles.errorText}>{codeError}</RNText>}

          <Pressable
            style={[styles.primaryBtn, styles.fieldSpaced, isLoggingIn && styles.primaryBtnDisabled]}
            onPress={() => {
              if (!code.trim()) {
                setCodeError(t('enter-code'))
                return
              }
              loginMutate(code.trim())
            }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <RNText style={styles.primaryBtnText}>{t('login')}</RNText>
            )}
          </Pressable>

          <Pressable style={styles.textLink} onPress={() => setStep('form')}>
            <RNText style={styles.textLinkText}>{t('common:back')}</RNText>
          </Pressable>
        </>
      )}

      <AlertDialog isOpen={showNoAccountDialog} onClose={() => setShowNoAccountDialog(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">{t('no-account-title')}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t('no-account-description', { email })}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onPress={() => setShowNoAccountDialog(false)}>
              <ButtonText>{t('common:confirm')}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13.5,
    color: C.ink3,
    marginBottom: 18,
    lineHeight: 19,
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
    marginTop: 18,
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
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
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
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.hair,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
})

export default SignIn

SignIn.displayName = 'SignIn'
