import { FC } from 'react'
import { Text } from '../text'
import { View } from '../view'

const ListEmptyComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <View className="h-full w-full flex justify-center items-center bg-info-100 rounded p-4">
      <Text className="text-xl ">{message}</Text>
    </View>
  )
}

export { ListEmptyComponent }
