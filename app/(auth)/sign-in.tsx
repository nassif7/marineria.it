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

const SignIn = () => {
  const { t } = useTranslation()
  const { signIn } = useSession()

  const onSuccess = () => router.replace('/')
  const onError = () => {
    handleToast()
  }

  const handleSignIn = async ({ email, password }: FormDate) => {
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
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action={'error'}
            variant="solid"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full  max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              {/* <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" /> */}
              <VStack space="xs">
                <ToastTitle className="font-semibold">{'Login Error'}</ToastTitle>
                <ToastDescription size="md">{t('login-screen.form.invalid-credentials')}</ToastDescription>
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

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require('../../assets/images/marineria_logo.png')}
        style={{
          width: horizontalScale(225),
          height: verticalScale(90),
          marginBottom: verticalScale(40),
          resizeMode: 'contain',
        }}
      />
      <KeyboardAvoidingView className="w-11/12" behavior={'padding'}>
        <AuthenticationForm authenticate={handleSignIn} />
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignIn
