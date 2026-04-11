import { Animated, Keyboard, ImageBackground, Platform, ScrollView, KeyboardAvoidingView, Easing } from 'react-native'
import { useEffect, useRef } from 'react'
import { View } from '@/components/ui'
import { horizontalScale, verticalScale } from '@/utils/metrics'

const AuthScreen = ({ children }: React.PropsWithChildren) => {
  const logoHeight = useRef(new Animated.Value(verticalScale(110))).current
  const logoMargin = useRef(new Animated.Value(verticalScale(30))).current

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => {
      Animated.parallel([
        Animated.timing(logoHeight, {
          toValue: verticalScale(70),
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(logoMargin, {
          toValue: verticalScale(10),
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start()
    })

    const hide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.parallel([
        Animated.timing(logoHeight, {
          toValue: verticalScale(90),
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(logoMargin, {
          toValue: verticalScale(30),
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start()
    })

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return (
    <ImageBackground source={require('@/assets/images/splash-bg.png')} style={{ flex: 1 }} resizeMode="cover">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-80}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: verticalScale(80),
            paddingHorizontal: 2,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.Image
            source={require('@/assets/images/marineria_logo.png')}
            style={{
              width: horizontalScale(300),
              height: logoHeight,
              marginBottom: logoMargin,
              resizeMode: 'contain',
            }}
          />
          <View className="rounded-md bg-background-100 p-4 w-11/12">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default AuthScreen

AuthScreen.displayName = 'AuthScreen'
