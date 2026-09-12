import { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useSession } from '@/Providers/SessionProvider'
import { TUserRole } from '@/api/types'

// Landing screen for shared-offer Universal Links (iOS) / App Links (Android) — see
// getOfferShareUrl in api/consts.ts. Renders nothing; it just decides where the tap should
// actually go and replaces itself, so it never shows up in the back stack.
const SharedOfferLink = () => {
  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const { auth, isGuest, isLoading, continueAsGuest } = useSession()

  useEffect(() => {
    if (isLoading || !offerId) return

    if (auth.token && auth.role === TUserRole.CREW) {
      router.replace(`/offer/${offerId}`)
      return
    }

    // No crew session (guest, recruiter-only, or logged out) — the public offer detail screen
    // doesn't require auth, so land there instead of forcing a sign-in first.
    if (!isGuest) continueAsGuest()
    router.replace(`/(tabs)/jobs/${offerId}`)
  }, [isLoading, offerId, auth.token, auth.role, isGuest, continueAsGuest])

  return null
}

export default SharedOfferLink
