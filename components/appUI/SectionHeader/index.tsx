// components/offers/OfferContract.tsx
import { FC, ElementType } from 'react'
import { HStack, Heading, Icon } from '@/components/ui'

interface SectionHeaderProps {
  icon?: ElementType
  title: string
}

const SectionHeader: FC<SectionHeaderProps> = ({ icon, title }) => (
  <HStack className="items-center gap-2 mb-2">
    {icon && <Icon as={icon} className="text-typography-600" size="md" />}
    <Heading size="md" className="text-typography-600">
      {title}
    </Heading>
  </HStack>
)

export default SectionHeader
