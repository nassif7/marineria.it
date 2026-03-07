import { InboxIcon } from 'lucide-react-native'
import { Center } from '@/components/ui/center'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

interface EmptyListProps {
  message?: string
}

export default function EmptyList({ message = 'No results found' }: EmptyListProps) {
  return (
    <Center className="py-12">
      <VStack space="sm" className="items-center">
        <Icon as={InboxIcon} className="text-typography-400" size="xl" />
        <Text className="text-typography-500 text-sm">{message}</Text>
      </VStack>
    </Center>
  )
}
