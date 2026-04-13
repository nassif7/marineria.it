import { useState, useRef } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { AuthScreen, LoginFormLinks } from '@/components/appUI'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
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
  Divider,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  Input,
  InputField,
  Text,
} from '@/components/ui'
import { checkEmail } from '@/api/auth'
import { useSession } from '@/Providers/SessionProvider/SessionProvider'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
  const { t } = useTranslation('login-screen')
  const showErrorToast = useAuthErrorToast()
  const { loginWithCode, signIn, continueAsGuest } = useSession()

  const [email, setEmail] = useState('')
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false)

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

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
    mutationFn: ({ email, password }: FormDate) => signIn(email, password),
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

  const handleOtpRequest = (emailArg: string) => {
    setEmail(emailArg)
    checkEmailMutate(emailArg)
  }

  return (
    <AuthScreen>
      {step === 'email' ? (
        <AuthenticationForm
          authenticate={passwordLoginMutate}
          onOtpRequest={handleOtpRequest}
          isLoading={isCheckingEmail || isPasswordLoggingIn}
        />
      ) : (
        <>
          <Text className="mb-3">{t('code-sent', { email })}</Text>

          <FormControl isInvalid={!!codeError}>
            <Input size="xl" className="bg-white" isInvalid={!!codeError}>
              <InputField
                className="bg-white"
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
            <ButtonText className="text-white">{t('login')}</ButtonText>
          </Button>
        </>
      )}

      <Divider className="my-4 bg-outline-300" />
      <Button
        size="md"
        variant="outline"
        action="secondary"
        className="w-full mb-4"
        onPress={() => {
          continueAsGuest()
          router.replace('/')
        }}
      >
        <ButtonText>{t('continue-without-login')}</ButtonText>
      </Button>
      <LoginFormLinks />

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

export default SignIn

SignIn.displayName = 'SignIn'
