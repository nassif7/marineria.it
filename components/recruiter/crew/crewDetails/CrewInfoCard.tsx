import { FC } from 'react'
import { Box, Heading, HStack, Text, Icon } from '@/components/ui'

interface CrewInfoCardProps {
  icon: React.ComponentType
  title: string
  content: string
  iconColor?: string
  titleColor?: string
}

const CrewInfoCard: FC<CrewInfoCardProps> = ({
  icon,
  title,
  content,
  iconColor = 'text-primary-600',
  titleColor = 'text-primary-600',
}) => {
  return (
    <Box className="bg-white rounded-2xl p-5  ">
      <HStack className="items-center gap-2 mb-3">
        <Icon as={icon} className={iconColor} size="md" />
        <Heading size="md" className={titleColor}>
          {title}
        </Heading>
      </HStack>
      <Text className="text-typography-900 font-semibold">{content}</Text>
    </Box>
  )
}

export default CrewInfoCard
