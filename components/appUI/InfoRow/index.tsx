import { FC } from 'react'
import { HStack, Text, Icon } from '@/components/ui'

const InfoRow: FC<{ icon: any; label: string; value: string; className?: string }> = ({
  icon,
  label,
  value,
  className,
}) => (
  <HStack space="xs" className={`items-center mb-1 ${className}`}>
    <Icon as={icon} className="text-typography-600" />
    <Text size="xs" shade={400} className="w-20 shrink-0">
      {label}
    </Text>
    <Text size="xs" semiBold shade={800} className="flex-1">
      {value}
    </Text>
  </HStack>
)

export default InfoRow
