import { useMemo } from 'react'
import { router } from 'expo-router'
import { AuthTypes } from '@/api/types'
import { VStack } from '@/components/ui'
import AuthenticationForm, { FormDate } from '@/components/AuthenticationForm'
import { useUser } from '@/Providers/UserProvider'
import { useSession } from '@/Providers/SessionProvider'
import { useShowToast } from '@/hooks'
import { View } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Image, KeyboardAvoidingView } from 'react-native'

const switchUser = () => {
  const { t } = useTranslation()

  const showToast = useShowToast(t('error'), t('loginError'), 'error')
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
  const onError = () => showToast()

  const handleSwitchSignIn = async ({ email, password }: FormDate) => {
    await signIn(email, password, onSuccess, onError)
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../../assets/images/bg-splash-2.png')}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundSize: 'contain',
        }}
      >
        <AuthenticationForm
          authenticate={handleSwitchSignIn}
          user={{ email: user?.email as string, role: activeRole }}
        />
      </ImageBackground>
    </View>
  )
}

export default switchUser
