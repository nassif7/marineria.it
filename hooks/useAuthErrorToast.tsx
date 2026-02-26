// hooks/useAuthErrorToast.ts
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast, Toast, ToastTitle, ToastDescription, HStack, VStack, Pressable, Icon } from '@/components/ui'
import { X } from 'lucide-react-native'

export const useAuthErrorToast = () => {
  const toast = useToast()
  const { t } = useTranslation()
  const [toastId, setToastId] = useState(0)

  const showErrorToast = () => {
    if (toast.isActive(toastId.toString())) return

    const newId = Math.random()
    setToastId(newId)

    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => (
        <Toast
          action="error"
          variant="solid"
          nativeID={'toast-' + id}
          className="p-4 gap-6 border-error-500 w-full max-w-[443px] flex-row justify-between"
        >
          <HStack space="md">
            <VStack space="xs">
              <ToastTitle className="font-semibold">{t('login-screen.form.error-title')}</ToastTitle>
              <ToastDescription size="md">{t('login-screen.form.invalid-credentials')}</ToastDescription>
            </VStack>
          </HStack>
          <Pressable onPress={() => toast.close(id)}>
            <Icon as={X} />
          </Pressable>
        </Toast>
      ),
    })
  }

  return showErrorToast
}

export default useAuthErrorToast
