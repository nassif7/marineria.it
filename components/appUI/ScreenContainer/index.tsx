import { FC, PropsWithChildren } from 'react'
import { View } from '@/components/ui'
import { ScrollView } from 'react-native'
import { FlatList, RefreshControl } from 'react-native'

const ScreenContainer: FC<
  PropsWithChildren<{
    className?: string
    scroll?: boolean
    refreshing?: boolean
    onRefresh?: () => void
  }>
> = ({ children, className = '', scroll = false, refreshing = false, onRefresh }) => {
  const Container = scroll ? ScrollView : View

  return (
    <Container
      className={`h-full px-2 flex-1 pb-5 bg-background-50 ${className} `}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {children}
    </Container>
  )
}

export default ScreenContainer
