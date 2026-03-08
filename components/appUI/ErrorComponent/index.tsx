import { AlertCircle } from 'lucide-react-native'
import { Center } from '@/components/ui/center'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

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
