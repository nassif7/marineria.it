import { FC, useEffect, useRef } from 'react'
import { Pressable, Animated, ActivityIndicator, View, StyleSheet } from 'react-native'
import { C } from '@/components/pro/tokens'

interface INotificationsToggleProps {
  enabled: boolean
  isPending: boolean
  handleSetPushNotification: () => void
}

const TRACK_WIDTH = 44
const TRACK_HEIGHT = 24
const THUMB_SIZE = 18
const PADDING = 3

const NotificationsToggle: FC<INotificationsToggleProps> = ({ enabled, isPending, handleSetPushNotification }) => {
  const anim = useRef(new Animated.Value(enabled ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, { toValue: enabled ? 1 : 0, duration: 160, useNativeDriver: true }).start()
  }, [enabled, anim])

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH - THUMB_SIZE - PADDING * 2],
  })

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        style={[nt.track, enabled && nt.trackOn]}
        onPress={handleSetPushNotification}
        disabled={isPending}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled, disabled: isPending }}
      >
        <Animated.View style={[nt.thumb, { transform: [{ translateX }] }]} />
      </Pressable>
      {isPending && (
        <View style={nt.loadingOverlay}>
          <ActivityIndicator size="small" color={C.orange} />
        </View>
      )}
    </View>
  )
}

const nt = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 6,
    backgroundColor: C.hair2,
    padding: PADDING,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: C.orange,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
})

export default NotificationsToggle
