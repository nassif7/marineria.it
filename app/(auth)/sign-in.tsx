import { useState } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
// import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignIn = () => {
  const showErrorToast = useAuthErrorToast()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showNoAccountDialog, setShowNoAccountDialog] = useState(false)

  const { mutate: loginMutate, isPending: isLoggingIn } = useMutation({
    mutationFn: async ({ username, code }: { username: string; code: string }) => {
      const response = await fetch('https://www.comunicazione.it/api/Login/LoginCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify({ username, code }),
      })
      const text = await response.text()
      console.log('loginCode status:', response.status)
      console.log('loginCode body:', text)
    },
    onSuccess: () => router.replace('/'),
    onError: (error) => {
      console.log('loginCode error:', error)
      showErrorToast()
    },
  })

  const { mutate, isPending: isCheckingEmail } = useMutation({
    mutationFn: (email: string) => {
      if (!email || !EMAIL_PATTERN.test(email)) {
        setEmailError('Please enter a valid email address')
        throw new Error('invalid-email')
      }
      return checkEmail(email)
    },
    onSuccess: (data) => {
      console.log('checkEmail response:', JSON.stringify(data, null, 2))
      if (data.result === 1) {
        setShowNoAccountDialog(true)
        return
      }
      const code = data.codePRO ?? data.codeARM
      console.log('code to login with:', code)
      if (code) {
        console.log('calling loginMutate with:', email, code)
        loginMutate({ username: email, code })
      } else {
        console.log('no code found in response')
      }
    },
    onError: (error) => {
      if (error.message !== 'invalid-email') showErrorToast()
    },
  })

  const isPending = isCheckingEmail || isLoggingIn

  const handleSubmit = () => mutate(email)

  const handleEmailChange = (value: string) => {
    setEmail(value.trimStart())
    if (emailError) setEmailError('')
  }

  const handleEmailBlur = () => {
    if (email && !EMAIL_PATTERN.test(email)) {
      setEmailError('Please enter a valid email address')
    }
  }

  return (
    <AuthScreen>
      {/* <AuthenticationForm authenticate={handleSignIn} isLoading={isPending} /> */}
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

      <Button size="xl" className="mt-3" onPress={handleSubmit} isDisabled={isPending}>
        {isPending && <ButtonSpinner color="white" />}
        <ButtonText className="text-white">Login</ButtonText>
      </Button>

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
