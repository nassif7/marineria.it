import { useState, useRef } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { AuthScreen, LoginFormLinks } from '@/components/appUI'
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignIn = () => {
  const showErrorToast = useAuthErrorToast()
  const { loginWithCode } = useSession()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false)

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  const { mutate: checkEmailMutate, isPending: isCheckingEmail } = useMutation({
    mutationFn: (email: string) => {
      if (!email || !EMAIL_PATTERN.test(email)) {
        setEmailError('Please enter a valid email address')
        throw new Error('invalid-email')
      }
      return checkEmail(email)
    },
    onSuccess: (data) => {
      if (data.result === 1) {
        setShowNoAccountDialog(true)
        return
      }
      setStep('code')
    },
    onError: (error) => {
      if ((error as Error).message !== 'invalid-email') showErrorToast()
    },
  })

  const { mutate: loginMutate, isPending: isLoggingIn } = useMutation({
    mutationFn: async (codeArg: string) => {
      await loginWithCode(email, codeArg)
    },
    onSuccess: () => router.replace('/'),
    onError: (error) => {
      console.log('loginWithCode error:', error)
      showErrorToast()
    },
  })

  const handleEmailChange = (value: string) => {
    setEmail(value.trimStart())
    if (emailError) setEmailError('')
  }

  const handleEmailBlur = () => {
    if (email && !EMAIL_PATTERN.test(email)) {
      setEmailError('Please enter a valid email address')
    }
  }

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

  return (
    <AuthScreen>
      {step === 'email' ? (
        <>
          <FormControl isInvalid={!!emailError}>
            <Input size="xl" className="bg-white" isInvalid={!!emailError}>
              <InputField
                className="bg-white"
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>
            <FormControlError>
              <FormControlErrorText>{emailError}</FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button size="xl" className="mt-3" onPress={() => checkEmailMutate(email)} isDisabled={isCheckingEmail}>
            {isCheckingEmail && <ButtonSpinner color="white" />}
            <ButtonText className="text-white">Continue</ButtonText>
          </Button>
        </>
      ) : (
        <>
          <Text className="mb-3">A code was sent to {email}. Please enter it below.</Text>

          <FormControl isInvalid={!!codeError}>
            <Input size="xl" className="bg-white" isInvalid={!!codeError}>
              <InputField
                className="bg-white"
                placeholder="Code"
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
                setCodeError('Please enter the code')
                return
              }
              loginMutate(code.trim())
            }}
            isDisabled={isLoggingIn}
          >
            {isLoggingIn && <ButtonSpinner color="white" />}
            <ButtonText className="text-white">Login</ButtonText>
          </Button>
        </>
      )}

      <Divider className="bg-outline-300 my-4" />
      <LoginFormLinks />

      <AlertDialog isOpen={showNoAccountDialog} onClose={() => setShowNoAccountDialog(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">No account found</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>There is no registered account associated with {email}.</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onPress={() => setShowNoAccountDialog(false)}>
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthScreen>
  )
}

export default SignIn

SignIn.displayName = 'SignIn'
