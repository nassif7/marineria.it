import { FC } from 'react'
import { Spinner } from '../spinner'
import { View } from '../view'

const Loading: FC = () => {
  return (
    <View className="h-full w-full flex align-middle justify-center items-center">
      <Spinner size="large" className="text-primary-700" />
    </View>
  )
}

export { Loading }
