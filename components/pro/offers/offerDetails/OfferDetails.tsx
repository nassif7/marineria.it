import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VStack, Text } from '@/components/ui'
import { Loading } from '@/components/ui/loading'
import { getProOfferById, applyToOffer } from '@/api'
import OfferHeader from './OfferHeader'
import OfferContract from './OfferContract'
import OfferPosition from './OfferPosition'
import OfferActions from './OfferActions'
import NotApplicableModal from './NotApplicableModal'
import ApplyModal from './ApplyModal'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { ScreenContainer, ErrorMessage } from '@/components/appUI'
import { useStatusToast } from '@/hooks'

export default function OfferDetailsScreen() {
  const queryClient = useQueryClient()
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { showToast } = useStatusToast()

  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const [showNotApplicable, setShowNotApplicable] = useState(false)
  const [showApply, setShowApply] = useState(false)

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => getProOfferById(offerId as string, token, language),
  })

  const offer = isSuccess ? data?.[0] : null

  const handleApply = () => {
    if (!offer?.offerApplicable) {
      setShowNotApplicable(true)
    } else if (!offer?.alreadyApplied) {
      setShowApply(true)
    }
  }

  const { mutate: handleConfirmApply, isPending } = useMutation({
    mutationFn: () => {
      return applyToOffer(token, parseInt(offerId as string), language)
    },
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('apply-success', { ns: 'offer' }),
      })
    },
    onError: () => {
      showToast({ emphasize: 'error', title: 'Error', description: t('unknown-error', { ns: 'common' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['offer', offerId],
      })
      queryClient.invalidateQueries({
        queryKey: ['offers'],
      })
      setShowApply(false)
    },
  })

  if (isLoading || isRefetching || isPending) {
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
        <>
          <VStack className="pb-2" space="xs">
            <OfferHeader offer={offer} />
            <OfferContract offer={offer} />
            <OfferPosition offer={offer} />
            <OfferActions offer={offer} onApply={handleApply} />
          </VStack>
          <NotApplicableModal visible={showNotApplicable} onClose={() => setShowNotApplicable(false)} reasons={[]} />
          <ApplyModal
            visible={showApply}
            onClose={() => setShowApply(false)}
            onConfirm={handleConfirmApply}
            isSubmitting={isPending}
          />
        </>
      )}
    </ScreenContainer>
  )
}
