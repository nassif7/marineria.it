// components/offers/OfferContract.tsx
import { FC, PropsWithChildren, ElementType } from 'react'
import { Box, HStack, Icon, Text, Pressable } from '@/components/ui'

export const SubSectionHeader: FC<{ icon?: ElementType; title?: string; isClickable?: boolean }> = ({
  icon,
  title,
  isClickable,
}) => {
  if (!icon && !title) return null
  return (
    <HStack className="items-center gap-1 mb-1">
      {icon && <Icon as={icon} className={isClickable ? 'text-primary-600' : 'text-typography-600'} size="sm" />}
      {title && (
        <Text size="sm" color={isClickable ? 'primary' : 'typography'}>
          {title}
        </Text>
      )}
    </HStack>
  )
}

export const SubSection: FC<
  PropsWithChildren<{
    className?: string
    title?: string
    icon?: ElementType
    onPress?: () => void
  }>
> = ({ children, className, title, icon, onPress }) => {
  const classes = onPress
    ? `bg-background-muted border border-primary-300 rounded-md p-2 ${className || ''}`
    : `bg-background-muted border border-background-300 rounded-md p-2 ${className || ''}`

  const Container = onPress ? Pressable : Box

  return (
    <>
      <Container onPress={onPress} className={classes}>
        {(icon || title) && <SubSectionHeader icon={icon} title={title} isClickable={!!onPress} />}
        {children}
      </Container>
    </>
  )
}
