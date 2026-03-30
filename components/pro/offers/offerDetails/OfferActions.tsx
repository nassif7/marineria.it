import React, { useState } from 'react'
import { Share } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VStack, Button, ButtonText, ButtonIcon } from '@/lib/components/ui'
import { Send, Share2, AlertCircle, CheckCircle } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { Section } from '@/lib/components'
import { applyToOffer } from '@/api'
import { useActiveProfile } from '@/Providers/UserProvider'
import { useCustomToast } from '@/hooks'
import ApplyModal from './ApplyModal'
import NotApplicableModal from './NotApplicableModal'

interface OfferActionsProps {
  offer: TOffer
}

const OfferActions: React.FC<OfferActionsProps> = ({ offer }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { token } = useActiveProfile()
  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const queryClient = useQueryClient()
  const { showToast } = useCustomToast()

  const [showNotApplicable, setShowNotApplicable] = useState(false)
  const [showApply, setShowApply] = useState(false)

  const { mutate: handleConfirmApply, isPending } = useMutation({
    mutationFn: () => applyToOffer(token, parseInt(offerId as string), language),
    onSuccess: () => {
      showToast({ emphasize: 'success', title: t('success', { ns: 'common' }) })
    },
    onError: () => {
      showToast({ emphasize: 'error', title: 'Error', description: t('unknown-error', { ns: 'common' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setShowApply(false)
    },
  })

  const handleApply = () => {
    if (!offer.offerApplicable) {
      setShowNotApplicable(true)
    } else if (!offer.alreadyApplied) {
      setShowApply(true)
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job offer: ${offer.offer}\n\nSalary: ${offer.salary_From} - ${offer.salary_To}\nRef: ${offer.reference}`,
        title: offer.offer,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getApplyButtonConfig = () => {
    if (offer.alreadyApplied) {
      return {
        action: 'secondary' as const,
        variant: 'outline' as const,
        disabled: true,
        icon: CheckCircle,
        text: t('already-applied', { ns: 'offer-screen' }),
      }
    }
    if (!offer.offerApplicable) {
      return {
        action: 'primary' as const,
        variant: 'solid' as const,
        disabled: false,
        icon: AlertCircle,
        text: t('not-matching-why', { ns: 'offer-screen' }),
      }
    }
    return {
      action: 'positive' as const,
      variant: 'solid' as const,
      disabled: false,
      icon: Send,
      text: t('apply-for-this-position', { ns: 'offer-screen' }),
    }
  }

  const buttonConfig = getApplyButtonConfig()

  return (
    <Section>
      <VStack space="xs">
        <Button
          size="md"
          action={buttonConfig.action}
          variant={buttonConfig.variant}
          onPress={handleApply}
          isDisabled={buttonConfig.disabled || isPending}
          className="rounded-md"
        >
          <ButtonIcon as={buttonConfig.icon} />
          <ButtonText className="ml-2">{buttonConfig.text}</ButtonText>
        </Button>

        <Button size="md" variant="solid" action="secondary" onPress={handleShare} className="rounded-md">
          <ButtonIcon as={Share2} className="text-white" />
          <ButtonText className="ml-2 text-white">{t('share-offer', { ns: 'offer-screen' })}</ButtonText>
        </Button>
      </VStack>

      <NotApplicableModal visible={showNotApplicable} onClose={() => setShowNotApplicable(false)} reasons={[]} />
      <ApplyModal
        visible={showApply}
        onClose={() => setShowApply(false)}
        onConfirm={handleConfirmApply}
        isSubmitting={isPending}
      />
    </Section>
  )
}

export default OfferActions
