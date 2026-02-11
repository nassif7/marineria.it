import { useMemo } from 'react'
import { AuthTypes } from '@/api/types'
import { useUser } from '@/Providers/UserProvider'
import React from 'react'
import { Image, KeyboardAvoidingView } from 'react-native'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { useSession } from '@/Providers/SessionProvider'
import { horizontalScale, verticalScale } from '@/utils/metrics'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import {
  Icon,
  VStack,
  View,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
  HStack,
  Pressable,
  Text,
} from '@/components/ui'
import { X } from 'lucide-react-native'

const switchUser = () => {
  const { t } = useTranslation()

  // const showToast = useShowToast(t('error'), t('loginError'), 'error')
  const { signIn } = useSession()
  const { user, activeProfile, switchProfile } = useUser()
  const activeRole = activeProfile?.role as AuthTypes.UserRole
  const role = useMemo(
    () => (activeRole == AuthTypes.UserRole.PRO ? AuthTypes.UserRole.OWNER : AuthTypes.UserRole.PRO),
    [activeRole]
  )
  const onSuccess = async () => {
    switchProfile && (await switchProfile(role))
    router.replace('/')
  }
  // const onError = () => showToast()
  const onError = () => console.log('error')

  const handleSwitchSignIn = async ({ email, password }: FormDate) => {
    await signIn(email, password, onSuccess, onError)
  }

  const toast = useToast()
  const [toastId, setToastId] = React.useState(0)
  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast()
    }
  }

  const showNewToast = () => {
    console.log('showing new toast at:', new Date().getSeconds())
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        console.log('render new toast at:', new Date().getSeconds())

        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action={'error'}
            variant="solid"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              {/* <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" /> */}
              <VStack space="xs">
                <ToastTitle className="font-semibold">{'Login Error'}</ToastTitle>
                <ToastDescription size="md">{'user name or password are wrong '}</ToastDescription>
              </VStack>
            </HStack>
            <HStack className="min-[450px]:gap-3 gap-1">
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={X} />
              </Pressable>
            </HStack>
          </Toast>
        )
      },
    })
  }

  const [showError, setShowError] = React.useState(false)

  const ErrorCom = () => {
    return (
      <View className="bg-red-500 p-4 rounded-md mb-4">
        <Text className="text-white">Error</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require('../../../assets/images/marineria_logo.png')}
        style={{
          width: horizontalScale(225),
          height: verticalScale(90),
          marginBottom: verticalScale(40),
          resizeMode: 'contain',
        }}
      />
      <KeyboardAvoidingView className="w-11/12" behavior={'padding'}>
        <AuthenticationForm
          authenticate={handleSwitchSignIn}
          user={{ email: user?.email as string, role: activeRole }}
        />
      </KeyboardAvoidingView>
      {showError && <ErrorCom />}
    </View>
  )
}

export default switchUser
