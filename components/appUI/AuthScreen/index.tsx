import { Image, ImageBackground } from 'react-native'
import { View } from '@/components/ui'
import { ScreenContainer } from '@/components/appUI'
import { horizontalScale, verticalScale } from '@/utils/metrics'

const AuthScreen = ({ children }: React.PropsWithChildren) => (
  <ImageBackground source={require('@/assets/images/splash-bg.png')} className="flex-1" resizeMode="cover">
    <View className="flex-1 justify-center items-center">
      <Image
        source={require('@/assets/images/marineria_logo.png')}
        style={{
          width: horizontalScale(225),
          height: verticalScale(90),
          marginBottom: verticalScale(40),
          resizeMode: 'contain',
        }}
      />
      <View className="rounded-md bg-background-100 p-4 w-11/12">{children}</View>
    </View>
  </ImageBackground>
)

export default AuthScreen
