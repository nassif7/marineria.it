// components/offers/OfferContract.tsx
import { FC, PropsWithChildren } from 'react'
import { Box } from '@/components/ui'

const SubSection: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <Box className="bg-background-muted border border-background-300 rounded-sm p-2 px-3">{children}</Box>
}

export default SubSection
