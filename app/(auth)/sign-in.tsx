import React from 'react'
import { ImageBackground, Image, KeyboardAvoidingView } from 'react-native'
import { View } from '@/components/ui'
import AuthenticationForm, { FormDate } from '@/components/AuthenticationForm'
import { useSession } from '@/Providers/SessionProvider'
import { useShowToast } from '@/hooks'
import { horizontalScale, verticalScale } from '@/util/metrics'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
  const { t } = useTranslation()

  const { signIn } = useSession()
  const showToast = useShowToast(t('error'), t('loginError'), 'error')
  const onSuccess = () => router.replace('/')
  const onError = () => showToast()

  const handleSignIn = async ({ email, password }: FormDate) => {
    await signIn(email, password, onSuccess, onError)
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/images/bg-2.png')}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundSize: 'contain',
        }}
      >
        <Image
          source={require('../../assets/images/marineria_logo.png')}
          style={{
            width: horizontalScale(225),
            height: verticalScale(90),
            marginBottom: verticalScale(50),
            resizeMode: 'contain',
          }}
        />
        <KeyboardAvoidingView style={{ width: '80%' }} behavior={'padding'}>
          <AuthenticationForm authenticate={handleSignIn} />
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  )
}

export default SignIn
