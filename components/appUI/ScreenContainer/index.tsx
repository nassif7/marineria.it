import { FC, PropsWithChildren } from 'react'
import { View } from '@/lib/components/ui'
import { ScrollView } from 'react-native'
import { FlatList, RefreshControl, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface IScreenContainerProps {
  className?: string
  scroll?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  handleScroll?: (e: any) => void
  scrollEventThrottle?: number
  contentContainerStyle?: StyleProp<ViewStyle>
}

const ScreenContainer: FC<PropsWithChildren<IScreenContainerProps>> = ({
  children,
  className = '',
  scroll = false,
  refreshing = false,
  onRefresh,
  handleScroll,
  scrollEventThrottle,
  contentContainerStyle,
}) => {
  const flatContentStyle = StyleSheet.flatten(contentContainerStyle)
  const insets = useSafeAreaInsets()

  return (
    <>
      {scroll ? (
        <ScrollView
          className={`flex-1 bg-background-50 pb-5  ${className} `}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={{
            ...flatContentStyle,
            paddingBottom: flatContentStyle?.paddingBottom
              ? insets.bottom + ((flatContentStyle?.paddingBottom as number) || 0)
              : undefined,
          }}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          className={`h-full flex-1 pb-5 bg-background-50  ${className} `}
          style={{
            ...flatContentStyle,
            paddingBottom: flatContentStyle?.paddingBottom
              ? insets.bottom + ((flatContentStyle?.paddingBottom as number) || 0)
              : undefined,
          }}
        >
          {children}
        </View>
      )}
    </>
  )
}

export default ScreenContainer

ScreenContainer.displayName = 'ScreenContainer'
