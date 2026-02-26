// components/offers/OfferContract.tsx
import { FC, PropsWithChildren } from 'react'
import { Box } from '@/components/ui'

const Section: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <Box className={`bg-white rounded-md p-3 + ${className ? className : ''}`}>{children}</Box>
}

export default Section
