import { useLocalSearchParams } from 'expo-router'
import { ActiveProfile, useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'
import { OfferDetails } from '@/components/pro/JobOffers'
import { CrewList } from '@/components/recruiter/Crew'
import { View } from '@/components/ui'

const JobOfferScreen = () => {
  const { offerId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { role } = activeProfile as ActiveProfile

  return (
    <>
      {role === AuthTypes.UserRole.PRO && <OfferDetails offerId={offerId as string} />}
      {role === AuthTypes.UserRole.OWNER && <CrewList offerId={offerId as string} />}
    </>
  )
}

export default JobOfferScreen
