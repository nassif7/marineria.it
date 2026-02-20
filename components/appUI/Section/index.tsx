// components/offers/OfferContract.tsx
import { FC, PropsWithChildren } from 'react'
import { Box } from '@/components/ui'

const Section: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <Box className={`${className ? className : ''} + bg-white rounded-md p-3`}>{children}</Box>
}

export default Section
