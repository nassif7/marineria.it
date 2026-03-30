import { FC, useState } from 'react'
import {
  Button,
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
} from '@/lib/components/ui'
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

const SwitchUser: FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const {
    auth: { role },
    switchAuth,
    storedAuthTokens,
    signIn,
  } = useSession()
  const { t } = useTranslation('settings-screen')

  const { activeProfile, switchProfile } = useUser()
  const showErrorToast = useAuthErrorToast()
  const activeRole = activeProfile?.role as TUserRole
  const proToken = storedAuthTokens[TUserRole.PRO]
  const ownerToken = storedAuthTokens[TUserRole.RECRUITER]
  const targetRole = useMemo(() => (activeRole === TUserRole.PRO ? TUserRole.RECRUITER : TUserRole.PRO), [activeRole])
  const hasBothTokens = proToken && ownerToken

  const handleSwitch = async () => {
    if (hasBothTokens) {
      await switchAuth(targetRole)
      router.replace('/')
    } else {
      setModalVisible(true)
    }
  }

  const { mutate: handleSignIn, isPending } = useMutation({
    mutationFn: ({ email, password }: FormDate) => signIn(email, password),
    onSuccess: async () => {
      await switchProfile?.(targetRole)
      router.replace('/')
    },
    onError: showErrorToast,
    onSettled: () => setModalVisible(false),
  })

  const handleClose = () => setModalVisible(false)
  const label = role == TUserRole.PRO ? t('login-as-recruiter') : t('login-as-crew')

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
            <AuthenticationForm authenticate={handleSignIn} isLoading={isPending} />
            <Divider className="bg-outline-300 my-4" />
            <LoginFormLinks isCrew={activeRole === TUserRole.PRO} isRecruiter={activeRole === TUserRole.RECRUITER} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SwitchUser

SwitchUser.displayName = 'SwitchUser'
