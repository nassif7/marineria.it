import { FC, useState, useRef } from 'react'
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Icon,
  Divider,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Text,
} from '@/components/ui'
import { X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { LoginFormLinks } from '@/components/appUI'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { checkEmail } from '@/api/auth'

const SwitchUser: FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
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

  const { activeProfile, switchProfile } = useUser()
  const showErrorToast = useAuthErrorToast()
  const activeRole = activeProfile?.role as TUserRole
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
    setStep('email')
    setCode('')
    setCodeError('')
  }

  const { mutate: handleSignIn, isPending: isSigningIn } = useMutation({
    mutationFn: ({ email, password }: FormDate) => signIn(email, password),
    onSuccess: async () => {
      await switchProfile?.(targetRole)
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
      await switchProfile?.(targetRole)
      router.replace('/')
    },
    onError: () => showErrorToast(),
    onSettled: () => setModalVisible(false),
  })

  const handleOtpRequest = (emailArg: string) => {
    setEmail(emailArg)
    checkEmailMutate(emailArg)
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

  const label = role == TUserRole.CREW ? t('login-as-recruiter') : t('login-as-crew')

  return (
    <>
      <Button onPress={handleSwitch}>
        <ButtonText className="text-white">{label}</ButtonText>
      </Button>

      <Modal isOpen={modalVisible} onClose={handleClose} avoidKeyboard>
        <ModalBackdrop />
        <ModalContent className="w-full mb-0 mt-auto rounded-t-md overflow-hidden p-4 max-h-[85%]">
          <ModalHeader className="justify-between items-center">
            <Heading size="xl" className="text-primary-600 flex-1">
              {label}
            </Heading>
            <ModalCloseButton onPress={handleClose}>
              <Icon as={X} className="text-typography-500" size="md" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            {step === 'email' ? (
              <AuthenticationForm
                authenticate={handleSignIn}
                onOtpRequest={handleOtpRequest}
                isLoading={isSigningIn || isCheckingEmail}
              />
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
                    loginWithCodeMutate(code.trim())
                  }}
                  isDisabled={isLoggingInWithCode}
                >
                  {isLoggingInWithCode && <ButtonSpinner color="white" />}
                  <ButtonText className="text-white">Login</ButtonText>
                </Button>
              </>
            )}

            <Divider className="bg-outline-300 my-4" />
            <LoginFormLinks isCrew={activeRole === TUserRole.CREW} isRecruiter={activeRole === TUserRole.RECRUITER} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SwitchUser

SwitchUser.displayName = 'SwitchUser'
