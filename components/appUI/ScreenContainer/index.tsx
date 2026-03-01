import { FC, PropsWithChildren } from 'react'
import { View } from '@/components/ui'
import { ScrollView } from 'react-native'
import { FlatList, RefreshControl, StyleProp, ViewStyle } from 'react-native'

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
  return (
    <>
      {scroll ? (
        <ScrollView
          className={`flex-1 bg-background-50 pb-5 ${className} `}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={handleScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`h-full flex-1 pb-5 bg-background-50 ${className} `}>{children}</View>
      )}
    </>
  )
}

export default ScreenContainer
