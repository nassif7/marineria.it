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
      className={`${className} h-full px-2 flex-1 pb-2 bg-background-50`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {children}
    </Container>
  )
}

export default ScreenContainer
