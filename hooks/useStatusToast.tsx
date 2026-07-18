import React from 'react'
import { Dimensions, View } from 'react-native'
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast'
import { Pressable } from '@/components/ui/pressable'
import { X } from 'lucide-react-native'

const TOAST_MARGIN = 20
const TOAST_WIDTH = Math.min(Dimensions.get('window').width - TOAST_MARGIN * 2, 480)

type ToastEmphasis = 'success' | 'error'

interface ShowToastOptions {
  emphasize: ToastEmphasis
  description?: string
  title: string
  duration?: number
}

const useStatusToast = () => {
  const toast = useToast()
  const [toastId, setToastId] = React.useState(0)

  const showToast = ({ emphasize, description, title, duration = 5000 }: ShowToastOptions) => {
    if (toast.isActive(toastId.toString())) return

    const newId = Math.random()
    setToastId(newId)

    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration,
      containerStyle: { marginTop: 40, marginLeft: TOAST_MARGIN, marginRight: TOAST_MARGIN, borderRadius: 8 },
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action={emphasize}
            variant="solid"
            nativeID={uniqueToastId}
            style={{
              width: TOAST_WIDTH,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <ToastTitle className="font-semibold">{title}</ToastTitle>
              {description && <ToastDescription size="md">{description}</ToastDescription>}
            </View>
            <Pressable onPress={() => toast.close(id)} hitSlop={10} style={{ padding: 2, flexShrink: 0 }}>
              <X size={18} color="#FFFFFF" strokeWidth={2.4} />
            </Pressable>
          </Toast>
        )
      },
    })
  }

  return { showToast }
}

export default useStatusToast
