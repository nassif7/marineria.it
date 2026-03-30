import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { VStack } from '@/lib/components/ui'
import { Loading } from '@/lib/components/ui/loading'
import { getProOfferById } from '@/api'
import OfferHeader from './OfferHeader'
import OfferContract from './OfferContract'
import OfferPosition from './OfferPosition'
import OfferActions from './OfferActions'
import { useActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { ScreenContainer, ErrorMessage } from '@/lib/components'

export default function OfferDetailsScreen() {
  const {
    i18n: { language },
  } = useTranslation()
  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const { token } = useActiveProfile()

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => getProOfferById(offerId as string, token, language),
  })

  const offer = isSuccess ? data?.[0] : null

  if (isLoading || isRefetching) {
    return (
      <ScreenContainer>
        <Loading />
      </ScreenContainer>
    )
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorMessage />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer scroll refreshing={isRefetching} onRefresh={refetch}>
      {isSuccess && offer && (
        <VStack className="pb-2" space="xs">
          <OfferHeader offer={offer} />
          <OfferContract offer={offer} />
          <OfferPosition offer={offer} />
          <OfferActions offer={offer} />
        </VStack>
      )}
    </ScreenContainer>
  )
}
