import { useState, useRef } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { View, Pressable, StyleSheet, Text as RNText } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Mail, Anchor, Users, EyeIcon, EyeOffIcon } from 'lucide-react-native'
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
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
} from '@/components/ui'
import { checkEmail } from '@/api/auth'
import { useSession } from '@/Providers/SessionProvider/SessionProvider'
import { useTranslation } from 'react-i18next'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignIn = () => {
  const { t } = useTranslation('login-screen')
  const showErrorToast = useAuthErrorToast()
  const { loginWithCode, signIn, continueAsGuest } = useSession()

  const [step, setStep] = useState<'email' | 'password' | 'code'>('email')
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

  return (
    <AuthScreen>
      {step === 'email' && (
        <>
          <RNText style={styles.sheetTitle}>{t('sheet-title')}</RNText>
          <RNText style={styles.sheetSubtitle}>{t('otp-description')}</RNText>

          <FormControl isInvalid={!!emailError} style={styles.field}>
            <Input size="xl">
              <InputSlot className="pl-3">
                <InputIcon as={Mail} />
              </InputSlot>
              <InputField
                placeholder="nome@email.com"
                value={email}
                onChangeText={(v) => {
                  setEmail(v)
                  if (emailError) setEmailError('')
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{emailError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button size="xl" className="mt-1" onPress={handleSendCode} isDisabled={isCheckingEmail}>
            {isCheckingEmail && <ButtonSpinner color="white" />}
            <ButtonText>{t('send-code')}</ButtonText>
          </Button>

          <Pressable style={styles.textLink} onPress={() => setStep('password')}>
            <RNText style={styles.textLinkText}>{t('sign-in-with-password-short')}</RNText>
          </Pressable>
        </>
      )}

      {step === 'password' && (
        <>
          <RNText style={styles.sheetTitle}>{t('title')}</RNText>
          <RNText style={styles.sheetSubtitle}>{t('password-description')}</RNText>

          <FormControl isInvalid={!!emailError} style={styles.field}>
            <Input size="xl">
              <InputSlot className="pl-3">
                <InputIcon as={Mail} />
              </InputSlot>
              <InputField
                placeholder="nome@email.com"
                value={email}
                onChangeText={(v) => {
                  setEmail(v)
                  if (emailError) setEmailError('')
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{emailError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isInvalid={!!passwordError} style={styles.field}>
            <Input size="xl">
              <InputField
                placeholder={t('password')}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(v) => {
                  setPassword(v)
                  if (passwordError) setPasswordError('')
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorText>{passwordError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button size="xl" className="mt-1" onPress={handlePasswordLogin} isDisabled={isPasswordLoggingIn}>
            {isPasswordLoggingIn && <ButtonSpinner color="white" />}
            <ButtonText>{t('login')}</ButtonText>
          </Button>

          <Pressable style={styles.textLink} onPress={() => setStep('email')}>
            <RNText style={styles.textLinkText}>{t('sign-in-with-code')}</RNText>
          </Pressable>
        </>
      )}

      {step !== 'code' && (
        <>
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
                <Anchor size={13} color="#444444" strokeWidth={2} />
                <RNText style={styles.chipRoleText}>{t('crew-label')}</RNText>
              </View>
            </Pressable>
            <Pressable
              style={styles.chip}
              onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}
            >
              <RNText style={styles.chipLabel}>{t('register-as')}</RNText>
              <View style={styles.chipRoleRow}>
                <Users size={13} color="#444444" strokeWidth={2} />
                <RNText style={styles.chipRoleText}>{t('recruiter-label')}</RNText>
              </View>
            </Pressable>
          </View>

          <Pressable
            style={styles.skipLink}
            onPress={() => {
              continueAsGuest()
              router.replace('/')
            }}
          >
            <RNText style={styles.skipText}>{t('continue-without-login')} →</RNText>
          </Pressable>
        </>
      )}

      {step === 'code' && (
        <>
          <Text className="mb-3">{t('code-sent', { email })}</Text>

          <FormControl isInvalid={!!codeError}>
            <Input size="xl" isInvalid={!!codeError}>
              <InputField
                placeholder={t('code-placeholder')}
                value={code}
                onChangeText={handleCodeChange}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{codeError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            size="xl"
            className="mt-3"
            onPress={() => {
              if (!code.trim()) {
                setCodeError(t('enter-code'))
                return
              }
              loginMutate(code.trim())
            }}
            isDisabled={isLoggingIn}
          >
            {isLoggingIn && <ButtonSpinner color="white" />}
            <ButtonText>{t('login')}</ButtonText>
          </Button>
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
    color: '#1a1a1a',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13.5,
    color: '#666666',
    marginBottom: 18,
    lineHeight: 19,
  },
  field: {
    marginBottom: 10,
  },
  textLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  textLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999999',
    letterSpacing: 0.4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  chip: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: '#999999',
    textTransform: 'uppercase',
  },
  chipRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipRoleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
})

export default SignIn

SignIn.displayName = 'SignIn'
