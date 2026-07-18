import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useToast, Toast, ToastTitle, ToastDescription, Pressable } from '@/components/ui'
import { X } from 'lucide-react-native'

const TOAST_MARGIN = 20
const TOAST_WIDTH = Math.min(Dimensions.get('window').width - TOAST_MARGIN * 2, 480)

export const useAuthErrorToast = () => {
  const toast = useToast()
  const { t } = useTranslation('login-screen')
  const [toastId, setToastId] = useState(0)

  const showErrorToast = () => {
    if (toast.isActive(toastId.toString())) return

    const newId = Math.random()
    setToastId(newId)

    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      containerStyle: { marginTop: 40, marginLeft: TOAST_MARGIN, marginRight: TOAST_MARGIN, borderRadius: 8 },
      render: ({ id }) => (
        <Toast
          action="error"
          variant="solid"
          nativeID={'toast-' + id}
          style={{
            width: TOAST_WIDTH,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <ToastTitle className="font-semibold">{t('login-error')}</ToastTitle>
            <ToastDescription size="md">{t('invalid-credentials')}</ToastDescription>
          </View>
          <Pressable onPress={() => toast.close(id)} hitSlop={10} style={{ padding: 2, flexShrink: 0 }}>
            <X size={18} color="#FFFFFF" strokeWidth={2.4} />
          </Pressable>
        </Toast>
      ),
    })
  }

  return showErrorToast
}

export default useAuthErrorToast
