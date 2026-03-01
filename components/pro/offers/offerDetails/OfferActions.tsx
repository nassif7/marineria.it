// components/offers/OfferActions.tsx
import React from 'react'
import { Share } from 'react-native'
import { useTranslation } from 'react-i18next'
import { VStack, Button, ButtonText, ButtonIcon } from '@/components/ui'
import { Send, Share2, AlertCircle, CheckCircle } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { Section } from '@/components/appUI'
interface OfferActionsProps {
  offer: TOffer
  onApply: () => void
}

const OfferActions: React.FC<OfferActionsProps> = ({ offer, onApply }) => {
  const { t } = useTranslation()
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
          onPress={onApply}
          isDisabled={buttonConfig.disabled}
          className="rounded-md"
        >
          <ButtonIcon as={buttonConfig.icon} />
          <ButtonText className="ml-2">{buttonConfig.text}</ButtonText>
        </Button>

        <Button size="md" variant="solid" action="secondary" onPress={handleShare} className="rounded-md">
          <ButtonIcon as={Share2} className=" text-white" />
          <ButtonText className="ml-2 text-white">{t('share-offer', { ns: 'offer-screen' })}</ButtonText>
        </Button>
      </VStack>
    </Section>
  )
}

export default OfferActions
