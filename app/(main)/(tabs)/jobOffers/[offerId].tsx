import { useLocalSearchParams } from 'expo-router'
import { ActiveProfile, useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'
import { OfferDetails } from '@/components/JobOffers'
import { CrewList } from '@/components/Crew'

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
