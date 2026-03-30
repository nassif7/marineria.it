// components/offers/OfferContract.tsx
import { FC, ElementType } from 'react'
import { HStack, Heading, Icon } from '@/lib/components/ui'

interface SectionHeaderProps {
  icon?: ElementType
  title: string
  className?: string
}

const SectionHeader: FC<SectionHeaderProps> = ({ icon, title, className }) => (
  <HStack className="items-center gap-2 mb-2">
    {icon && <Icon as={icon} className={`text-typography-600 ${className ? className : ''}`} size="md" />}
    <Heading size="sm" className={`text-typography-600 ${className ? className : ''}`}>
      {title}
    </Heading>
  </HStack>
)

export default SectionHeader
