// components/offers/OfferContract.tsx
import { FC, PropsWithChildren, ElementType } from 'react'
import { Box, HStack, Icon, Text } from '@/components/ui'

export const SubSection: FC<
  PropsWithChildren<{
    className?: string
  }>
> = ({ children, className }) => {
  return (
    <Box className={`bg-background-muted border border-background-300 rounded-md p-2 + ${className ? className : ''}`}>
      {children}
    </Box>
  )
}

export const SubSectionHeader: FC<{ icon: ElementType; title: string }> = ({ icon, title }) => {
  return (
    <HStack className="items-center gap-1 mb-1">
      <Icon as={icon} className="text-typography-600" size="sm" />
      <Text size="sm">{title}</Text>
    </HStack>
  )
}
