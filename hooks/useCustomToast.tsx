import React from 'react'
import { useToast, Toast, ToastTitle, ToastDescription, HStack, VStack, Icon } from '@/lib/components/ui'
import { Pressable } from '@/lib/components/ui/pressable'
import { X } from 'lucide-react-native'

type ToastEmphasis = 'success' | 'error'

interface ShowToastOptions {
  emphasize: ToastEmphasis
  title: string
  description?: string
  duration?: number
}

const useCustomToast = () => {
  const toast = useToast()
  const [toastId, setToastId] = React.useState(0)

  const showToast = ({ emphasize, title, description, duration = 5000 }: ShowToastOptions) => {
    if (toast.isActive(toastId.toString())) return

    const newId = Math.random()
    setToastId(newId)

    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration,
      containerStyle: { marginTop: 40, marginLeft: 20, marginRight: 20, borderRadius: 8 },
      render: ({ id }) => (
        <Toast
          action={emphasize}
          variant="solid"
          nativeID={'toast-' + id}
          className="p-4 gap-6 border-error-500 w-full max-w-[443px] flex-row justify-between"
        >
          <HStack space="md">
            <VStack space="xs">
              <ToastTitle className="font-semibold">{title}</ToastTitle>
              {description && <ToastDescription size="md">{description}</ToastDescription>}
            </VStack>
          </HStack>
          <HStack className="min-[450px]:gap-3 gap-1">
            <Pressable onPress={() => toast.close(id)}>
              <Icon as={X} />
            </Pressable>
          </HStack>
        </Toast>
      ),
    })
  }

  return { showToast }
}

export default useCustomToast
