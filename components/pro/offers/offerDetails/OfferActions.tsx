// components/offers/OfferActions.tsx
import React from 'react'
import { Share } from 'react-native'
import { VStack, Button, ButtonText, ButtonIcon } from '@/components/ui'
import { Send, Share2, AlertCircle, CheckCircle } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { Section } from '@/components/appUI'
interface OfferActionsProps {
  offer: TOffer
  onApply: () => void
}

const OfferActions: React.FC<OfferActionsProps> = ({ offer, onApply }) => {
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
        text: 'Already Applied',
      }
    }

    if (!offer.offerApplicable) {
      return {
        action: 'warning' as const,
        variant: 'solid' as const,
        disabled: false,
        icon: AlertCircle,
        text: 'Not matching! Why? ',
      }
    }

    return {
      action: 'positive' as const,
      variant: 'solid' as const,
      disabled: false,
      icon: Send,
      text: 'Apply for this position',
    }
  }

  const buttonConfig = getApplyButtonConfig()

  return (
    <Section>
      <VStack space="xs">
        <Button
          size="lg"
          // action={buttonConfig.action}
          variant={buttonConfig.variant}
          onPress={onApply}
          isDisabled={buttonConfig.disabled}
          className="rounded-md"
        >
          <ButtonIcon as={buttonConfig.icon} />
          <ButtonText className="ml-2">{buttonConfig.text}</ButtonText>
        </Button>

        <Button size="lg" variant="solid" action="secondary" onPress={handleShare} className="rounded-md">
          <ButtonIcon as={Share2} className=" text-white" />
          <ButtonText className="ml-2 text-white">Share this offer</ButtonText>
        </Button>
      </VStack>
    </Section>
  )
}

export default OfferActions
