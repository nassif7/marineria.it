import { useEffect, useRef, useMemo } from 'react'
import { View, Image, Animated, Dimensions, StyleSheet, Text } from 'react-native'

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window')

// ─── Bubble configs ───────────────────────────────────────────────────────────

function makeRushBubbles() {
  return Array.from({ length: 80 }, (_, i) => ({
    id: `r${i}`,
    left: 0.02 + ((i * 31.7) % 96) / 100,
    size: 2 + ((i * 2.3) % 5),
    duration: 1800 + ((i * 500) % 1600),
    delay: (i * 120) % 2800,
    wobble: (i % 2 === 0 ? 1 : -1) * (4 + ((i * 3.1) % 10)),
  }))
}

function makeCalmBubbles() {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `c${i}`,
    left: 0.05 + ((i * 47.3) % 90) / 100,
    size: 6 + ((i * 4.7) % 16),
    duration: 7000 + ((i * 2100) % 7000),
    delay: 3000 + ((i * 1300) % 10000),
    wobble: (i % 2 === 0 ? 1 : -1) * (10 + ((i * 5.3) % 20)),
  }))
}

type BubbleConfig = ReturnType<typeof makeRushBubbles>[number]

// ─── Single Bubble ────────────────────────────────────────────────────────────

function Bubble({ b }: { b: BubbleConfig }) {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: b.duration,
        delay: b.delay,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [])

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(SCREEN_H + b.size * 2)],
  })
  const translateX = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, b.wobble, b.wobble * 0.3],
  })
  const opacity = anim.interpolate({
    inputRange: [0, 0.08, 0.88, 1],
    outputRange: [0, 0.75, 0.45, 0],
  })

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: SCREEN_W * b.left,
          bottom: -b.size * 2,
          width: b.size,
          height: b.size,
          borderRadius: b.size / 2,
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  )
}

// ─── Main Splash ──────────────────────────────────────────────────────────────

type Props = {
  isLoading: boolean
}

export default function MarineriaSplash({ isLoading }: Props) {
  const fadeOut = useRef(new Animated.Value(1)).current
  const logoFloat = useRef(new Animated.Value(0)).current
  const contentFade = useRef(new Animated.Value(0)).current

  const rushBubbles = useMemo(() => makeRushBubbles(), [])
  const calmBubbles = useMemo(() => makeCalmBubbles(), [])

  // Logo gentle float loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [])

  // Content fades in on mount
  useEffect(() => {
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  // Fade out whole splash once session resolves
  useEffect(() => {
    if (!isLoading) {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }).start()
    }
  }, [isLoading])

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]} pointerEvents={isLoading ? 'auto' : 'none'}>
      {/* Background */}
      <Image source={require('@/assets/images/splash-bg.png')} style={styles.bg} resizeMode="cover" />

      {/* Top depth overlay */}
      <View style={styles.overlay} pointerEvents="none" />

      {/* Rush bubbles — small, dense, fast */}
      {rushBubbles.map((b) => (
        <Bubble key={b.id} b={b} />
      ))}

      {/* Calm bubbles — bigger, sparse, slow */}
      {calmBubbles.map((b) => (
        <Bubble key={b.id} b={b} />
      ))}

      {/* Logo + text, floating together */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentFade,
            transform: [{ translateY: logoFloat }],
          },
        ]}
      >
        <Image
          source={require('@/assets/images/marineria_logo_transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Animated.View style={[styles.textBlock, { opacity: contentFade }]}>
          <Text style={styles.title}>Marineria.it</Text>
          <Text style={styles.subtitle}>Welcome Aboard</Text>
        </Animated.View>
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
    backgroundColor: '#FFF5F0',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,30,60,0.10)',
  },
  bubble: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  content: {
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  logo: {
    width: 280,
    height: 100,
  },
  textBlock: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.97)',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 6,
    color: 'rgba(255,255,255,0.80)',
    fontStyle: 'italic',
  },
})
