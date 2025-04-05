import { useMemo } from 'react'
import { router } from 'expo-router'
import { AuthTypes } from '@/api/types'
import AuthenticationForm, { FormDate } from '@/components/AuthenticationForm'
import { useUser } from '@/Providers/UserProvider'
import { useSession } from '@/Providers/SessionProvider'
import { useShowToast } from '@/hooks'
import { View } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Image, KeyboardAvoidingView } from 'react-native'
import { horizontalScale, verticalScale } from '@/util/metrics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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

  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../../../assets/images/bg-2.png')}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundSize: 'contain',
        }}
      >
        <Image
          source={require('../../../../assets/images/marineria_logo.png')}
          style={{
            width: horizontalScale(225),
            height: verticalScale(90),
            marginBottom: verticalScale(50),
            resizeMode: 'contain',
          }}
        />
        <KeyboardAvoidingView style={{ width: '80%' }} behavior={'padding'}>
          <AuthenticationForm
            authenticate={handleSwitchSignIn}
            user={{ email: user?.email as string, role: activeRole }}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

export default switchUser
