import { useEffect, useRef, useMemo } from 'react'
import { View, Image, Animated, ActivityIndicator, StyleSheet, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
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

type Props = {
  isLoading: boolean
}

export default function MarineriaSplash({ isLoading }: Props) {
  const fadeOut = useRef(new Animated.Value(1)).current
  const contentFade = useRef(new Animated.Value(0)).current
  const stars = useMemo(() => makeStars(), [])

  useEffect(() => {
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isLoading])

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]} pointerEvents={isLoading ? 'auto' : 'none'}>
      <Animated.View style={[styles.content, { opacity: contentFade }]}>
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

        <ActivityIndicator size="small" color={C.orange} style={styles.spinner} />
        <Text style={styles.welcomeText}>Welcome Aboard</Text>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
  },
  content: {
    alignItems: 'center',
    gap: 20,
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
  spinner: {
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    color: C.ink3,
    textTransform: 'uppercase',
  },
})
