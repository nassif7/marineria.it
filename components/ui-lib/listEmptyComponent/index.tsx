import { FC } from 'react'
import { View, Text } from '@/components/ui-lib'

const ListEmptyComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <View className="flex items-center justify-center bg-info-100 rounded p-4 m-4 my-40 ">
      <Text className="text-xl ">{message}</Text>
    </View>
  )
}

export { ListEmptyComponent }
