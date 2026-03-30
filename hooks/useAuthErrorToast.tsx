import { useTranslation } from 'react-i18next'
import useCustomToast from './useCustomToast'

export const useAuthErrorToast = () => {
  const { t } = useTranslation('login-screen')
  const { showToast } = useCustomToast()

  return () =>
    showToast({
      emphasize: 'error',
      title: t('login-error'),
      description: t('invalid-credentials'),
      duration: 3000,
    })
}

export default useAuthErrorToast
