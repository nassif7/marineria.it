import { CrewProfile } from '@/components/recruiter/crew'
import RecruiterSearchProvider from '@/Providers/RecruiterSearchProvider'

// Reached from a tapped recruiter notification (see navigateToCrewFromNotification in
// hooks/useNotifications.ts), outside the (tabs)/recruiter/search/[searchId] tree where
// RecruiterSearchProvider normally lives — mount it here too so ContactCrewModal's paid
// check (which reads the provider, not the searchId route param) sees the real search.
export default function CrewProfileModalScreen() {
  return (
    <RecruiterSearchProvider>
      <CrewProfile isModal />
    </RecruiterSearchProvider>
  )
}
