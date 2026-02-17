// components/offers/OfferContract.tsx
import { FC, PropsWithChildren } from 'react'
import { Box } from '@/components/ui'

const Section: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Box className="bg-white rounded-sm p-3">{children}</Box>
}

export default Section
