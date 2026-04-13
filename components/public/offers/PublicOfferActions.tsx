import { Share } from 'react-native'
import { useTranslation } from 'react-i18next'
import { VStack, Button, ButtonText, ButtonIcon } from '@/components/ui'
import { Send, Share2 } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { Section } from '@/components/appUI'

interface PublicOfferActionsProps {
  offer: TOffer
  onApply: () => void
}

const PublicOfferActions = ({ offer, onApply }: PublicOfferActionsProps) => {
  const { t } = useTranslation('offer-screen')

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${offer.offer}\n\n${offer.salary_From} - ${offer.salary_To}\nRef: ${offer.reference}`,
        title: offer.offer,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Section>
      <VStack space="xs">
        <Button size="md" action="positive" variant="solid" onPress={onApply} className="rounded-md">
          <ButtonIcon as={Send} />
          <ButtonText className="ml-2">{t('apply-for-this-position')}</ButtonText>
        </Button>
        <Button size="md" variant="solid" action="secondary" onPress={handleShare} className="rounded-md">
          <ButtonIcon as={Share2} className="text-white" />
          <ButtonText className="ml-2 text-white">{t('share-offer')}</ButtonText>
        </Button>
      </VStack>
    </Section>
  )
}

export default PublicOfferActions
