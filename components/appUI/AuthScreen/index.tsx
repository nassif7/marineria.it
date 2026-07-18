import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  KeyboardEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { C } from '@/components/pro/tokens'

const LOGO_BADGE_W = 200
const LOGO_BADGE_H = 90

function makeStars() {
  return Array.from({ length: 14 }, (_, i) => ({
    left: (i * 37 + 8) % (LOGO_BADGE_W - 6),
    top: (i * 19 + 6) % (LOGO_BADGE_H - 6),
    size: ((i % 3) + 1) * 1.3,
    opacity: 0.25 + ((i * 13) % 45) / 100,
  }))
}

const BRAND_NORMAL = 190
const BRAND_KEYBOARD = 0

const AuthScreen = ({ children }: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets()
  const brandHeight = useRef(new Animated.Value(BRAND_NORMAL)).current
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const keyboardVisible = keyboardHeight > 0
  const stars = useMemo(() => makeStars(), [])

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
      <View style={styles.kavContainer}>
        <Animated.View style={[styles.brandArea, { height: brandHeight, paddingTop: Math.max(insets.top - 28, 0) }]}>
          <View style={styles.logoShadow}>
            <View style={styles.logoBadge}>
              <LinearGradient
                colors={['#FF8A50', C.orange, C.orangeText]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {stars.map((star, i) => (
                <View
                  key={i}
                  pointerEvents="none"
                  style={[
                    styles.star,
                    {
                      left: star.left,
                      top: star.top,
                      width: star.size,
                      height: star.size,
                      borderRadius: star.size / 2,
                      opacity: star.opacity,
                    },
                  ]}
                />
              ))}
              <Image source={require('@/assets/images/marineria_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
          <Text style={styles.welcomeText}>Welcome Aboard</Text>
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
    backgroundColor: C.bg,
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  brandArea: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: C.bg,
    gap: 14,
    overflow: 'hidden',
  },
  logoShadow: {
    width: LOGO_BADGE_W,
    height: LOGO_BADGE_H,
    borderRadius: 20,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  logoBadge: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150,
    height: 52,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    color: C.ink3,
    textTransform: 'uppercase',
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
