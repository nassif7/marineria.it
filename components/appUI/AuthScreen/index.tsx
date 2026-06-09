import { LinearGradient } from 'expo-linear-gradient'
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useEffect, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_W } = Dimensions.get('window')

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 13) % (SCREEN_W - 8),
  top: (i * 53 + 90) % 620,
  size: ((i % 3) + 1) * 2,
}))

const BRAND_NORMAL = 200
const BRAND_KEYBOARD = 72

const AuthScreen = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets()
  const brandHeight = useRef(new Animated.Value(BRAND_NORMAL)).current

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      Animated.timing(brandHeight, {
        toValue: BRAND_KEYBOARD,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start()
    })
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      Animated.timing(brandHeight, {
        toValue: BRAND_NORMAL,
        duration: 250,
        useNativeDriver: false,
      }).start()
    })
    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#2A7A8C', '#1A5470', '#0E3F5C', '#082A3F']}
        locations={[0, 0.45, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {PARTICLES.map((p, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[
            styles.particle,
            { left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: p.size / 2 },
          ]}
        />
      ))}

      <KeyboardAvoidingView style={styles.kavContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={[styles.brandArea, { height: brandHeight, paddingTop: insets.top + 10 }]}>
          <Image
            source={require('@/assets/images/marineria_logo_transparent.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  brandArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 240,
    height: 80,
  },
  sheet: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 8,
  },
})

export default AuthScreen

AuthScreen.displayName = 'AuthScreen'
