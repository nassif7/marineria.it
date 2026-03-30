import { InboxIcon } from 'lucide-react-native'
import { Center } from '@/lib/components/ui/center'
import { Icon } from '@/lib/components/ui/icon'
import { Text } from '@/lib/components/ui/text'
import { VStack } from '@/lib/components/ui/vstack'

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
