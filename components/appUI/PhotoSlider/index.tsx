import { FC, useState, useRef, useEffect } from 'react'
import { TouchableOpacity, Modal, FlatList, useWindowDimensions, View, Image } from 'react-native'
import { Text, Icon } from '@/components/ui'
import { X } from 'lucide-react-native'

const PhotoSlider: FC<{
  visible: boolean
  photos: string[]
  initialIndex: number
  onClose: () => void
  title?: string
  subtitle?: string
}> = ({ visible, photos, initialIndex, onClose, title, subtitle }) => {
  const { width, height } = useWindowDimensions()
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const flatListRef = useRef<FlatList>(null)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset to first photo and start autoplay when modal opens
  useEffect(() => {
    if (visible) {
      setActiveIndex(0)
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: false })
      }, 50)

      if (photos.length > 1) {
        autoplayRef.current = setInterval(() => {
          setActiveIndex((prev) => {
            const next = (prev + 1) % photos.length
            flatListRef.current?.scrollToIndex({ index: next, animated: true })
            return next
          })
        }, 3000)
      }
    } else {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [visible, photos.length])

  // Pause autoplay on manual swipe, restart after 5s
  const handleSwipe = (index: number) => {
    setActiveIndex(index)
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    if (photos.length > 1) {
      autoplayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % photos.length
          flatListRef.current?.scrollToIndex({ index: next, animated: true })
          return next
        })
      }, 5000)
    }
  }

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 56,
            right: 16,
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <Icon as={X} size="md" className="text-white" />
        </TouchableOpacity>

        {photos.length > 1 && (
          <View
            style={{
              position: 'absolute',
              top: 56,
              left: 16,
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 4,
            }}
          >
            <Text size="xs" bold className="text-white">
              {activeIndex + 1} / {photos.length}
            </Text>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={photos}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={0}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width)
            handleSwipe(index)
          }}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item }) => (
            <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: item }} style={{ width, height: height * 0.75 }} resizeMode="contain" />
            </View>
          )}
        />

        {photos.length > 1 && (
          <View
            style={{
              position: 'absolute',
              bottom: 80,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {photos.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </View>
        )}

        <View style={{ position: 'absolute', bottom: 36, width: '100%', alignItems: 'center' }}>
          {title && (
            <Text bold size="lg" className="text-white">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text size="sm" className="text-white/60">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default PhotoSlider
