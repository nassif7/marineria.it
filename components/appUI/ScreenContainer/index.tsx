import { FC, PropsWithChildren } from 'react'
import { View } from '@/components/ui'
import { ScrollView } from 'react-native'
import { FlatList, RefreshControl } from 'react-native'

const ScreenContainer: FC<
  PropsWithChildren<{
    className?: string
    useScrollView?: boolean
    refreshing?: boolean
    onRefresh?: () => void
  }>
> = ({ children, className: containerClassName = '', useScrollView = false, refreshing = false, onRefresh }) => {
  const Container = useScrollView ? ScrollView : View

  return (
    <Container
      className={`${containerClassName} h-full px-2 flex-1 pb-2 bg-background-100`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {children}
    </Container>
  )
}

export default ScreenContainer
