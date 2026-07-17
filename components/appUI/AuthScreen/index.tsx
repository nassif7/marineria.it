import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_W } = Dimensions.get('window')

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 13) % (SCREEN_W - 8),
  top: (i * 53 + 90) % 620,
  size: ((i % 3) + 1) * 2,
}))

const BRAND_NORMAL = 200
const BRAND_KEYBOARD = 0

const AuthScreen = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets()
  const brandHeight = useRef(new Animated.Value(BRAND_NORMAL)).current
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const keyboardVisible = keyboardHeight > 0

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height)
        Animated.timing(brandHeight, {
          toValue: BRAND_KEYBOARD,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start()
      }
    )
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardHeight(0)
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

      <View style={styles.kavContainer}>
        <Animated.View style={[styles.brandArea, { height: brandHeight, paddingTop: Math.max(insets.top - 8, 0) }]}>
          <Image
            source={require('@/assets/images/marineria_logo_transparent.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={[styles.sheet, keyboardVisible && styles.sheetExpanded]}>
          <ScrollView
            style={keyboardVisible && styles.sheetExpanded}
            contentContainerStyle={[
              styles.sheetContent,
              keyboardVisible && styles.sheetContentExpanded,
              { paddingBottom: keyboardVisible ? keyboardHeight + 16 : Math.max(insets.bottom, 16) },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>

      {keyboardVisible && (
        <BlurView intensity={40} tint="light" style={[styles.topBlur, { height: insets.top }]} pointerEvents="none">
          <View style={styles.topBlurTint} />
        </BlurView>
      )}
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
    justifyContent: 'flex-start',
  },
  logoImage: {
    width: 240,
    height: 80,
  },
  sheet: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  sheetExpanded: {
    flex: 1,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 8,
  },
  sheetContentExpanded: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  topBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  topBlurTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
})

export default AuthScreen

AuthScreen.displayName = 'AuthScreen'
