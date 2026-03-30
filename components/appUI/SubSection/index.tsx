// components/offers/OfferContract.tsx
import { FC, PropsWithChildren, ElementType } from 'react'
import { Box, HStack, Icon, Text, Pressable, Badge, BadgeText } from '@/lib/components/ui'
import { ChevronRight } from 'lucide-react-native'

export const SubSectionHeader: FC<{
  icon?: ElementType
  title?: string
  isPressable?: boolean
  badge?: string | number
}> = ({ icon, title, isPressable, badge }) => {
  if (!icon && !title) return null
  return (
    <HStack className="items-start justify-between mb-1">
      <HStack space="xs" className="items-center flex-1 mr-2">
        {icon && <Icon as={icon} className={isPressable ? 'text-primary-600' : 'text-typography-600'} size="sm" />}
        {title && (
          <Text size="sm" color={isPressable ? 'primary' : 'typography'}>
            {title}
          </Text>
        )}
        {badge !== undefined && (
          <Badge action="muted" variant="solid" className="rounded-full ml-1.5">
            <BadgeText className="text-xs">{badge}</BadgeText>
          </Badge>
        )}
      </HStack>
      {isPressable && <Icon as={ChevronRight} className={'text-typography-600'} size="md" />}
    </HStack>
  )
}

export const SubSection: FC<
  PropsWithChildren<{
    className?: string
    title?: string
    icon?: ElementType
    badge?: string | number
    onPress?: () => void
  }>
> = ({ children, className, title, icon, onPress, badge }) => {
  const classes = `bg-background-muted border border-background-300 rounded-md p-2 ${className || ''}`

  const Container = onPress ? Pressable : Box

  return (
    <>
      <Container onPress={onPress} className={classes}>
        {(icon || title) && <SubSectionHeader icon={icon} title={title} isPressable={!!onPress} badge={badge} />}
        {children}
      </Container>
    </>
  )
}
