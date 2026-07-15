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
    <Center style={{ paddingTop: 48 }}>
      <VStack space="lg" className="items-center px-8">
        <Icon as={InboxIcon} className="text-typography-400" size="xl" style={{ width: 36, height: 36 }} />
        <Text className="text-typography-500 text-base text-center" style={{ fontWeight: '500' }}>
          {message}
        </Text>
      </VStack>
    </Center>
  )
}
