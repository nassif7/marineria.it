import { AlertCircle } from 'lucide-react-native'
import { Center } from '@/lib/components/ui/center'
import { Icon } from '@/lib/components/ui/icon'
import { Text } from '@/lib/components/ui/text'
import { VStack } from '@/lib/components/ui/vstack'

interface ErrorMessageProps {
  title?: string
  description?: string
}

export default function ErrorMessage({ title = 'Error', description = 'Please try again later' }: ErrorMessageProps) {
  return (
    <Center className="py-12">
      <VStack space="sm" className="items-center">
        <Icon as={AlertCircle} className="text-error-500" size="xl" />
        <Text className="text-error-500 font-medium text-sm">{title}</Text>
        <Text className="text-typography-500 text-xs">{description}</Text>
      </VStack>
    </Center>
  )
}
