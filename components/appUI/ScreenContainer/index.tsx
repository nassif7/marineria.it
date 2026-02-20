import { FC, PropsWithChildren } from 'react'
import { View } from '@/components/ui'
import { ScrollView } from 'react-native'

const ScreenContainer: FC<
  PropsWithChildren<{
    className?: string
    useScrollView?: boolean
  }>
> = ({ children, className: containerClassName = '', useScrollView = false }) => {
  const Container = useScrollView ? ScrollView : View

  return <Container className={`${containerClassName} h-full px-2 flex-1 pb-2 bg-background-100`}>{children}</Container>
}

export default ScreenContainer
