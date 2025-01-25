import React, { useState } from 'react'
import { Icon, VStack, View, Toast, ToastTitle, ToastDescription, useToast, HStack, Pressable } from '@/components/ui'
import { X, HelpCircleIcon } from 'lucide-react-native'

// #TODO: Extend the hook to support variants, dynamic texts and so on!

export type ToastEmphasis = 'error' | 'warning' | 'success' | 'info'
export type ToastPlacements = 'top' | 'top right' | 'top left' | 'bottom' | 'bottom left' | 'bottom right'

const useShowToast = (
  title: string,
  message: string,
  emphasis: ToastEmphasis,
  placement: ToastPlacements = 'top',
  duration: number = 3000
) => {
  const toast = useToast()
  const [toastId, setToastId] = useState(0)

  const showToast = () => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: placement,
      duration: duration,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action={emphasis}
            variant="solid"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              {/* <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" /> */}
              <VStack space="xs">
                <ToastTitle className="font-semibold">{title}</ToastTitle>
                <ToastDescription size="md">{message}</ToastDescription>
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

  const onShowToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showToast()
    }
  }

  return onShowToast
}

export default useShowToast
