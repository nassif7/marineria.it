import { FC } from 'react'
import { ButtonText, Box, HStack, Button, ButtonIcon } from '@/components/ui'
import { Check, X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface CrewActionButtonsProps {
  onAccept: () => void
  onDecline: () => void
  acceptLabel: string
  declineLabel: string
}

const CrewActionButtons: FC<CrewActionButtonsProps> = ({ onAccept, onDecline, acceptLabel, declineLabel }) => {
  const { t } = useTranslation()
  return (
    <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-outline-100 p-3 shadow-lg rounded-lg">
      <HStack className="gap-3">
        <Button className="flex-1 rounded-lg" onPress={onAccept} action="positive" size="lg">
          <ButtonIcon as={Check} />
          <ButtonText className="ml-2">{t(acceptLabel)}</ButtonText>
        </Button>
        <Button className="flex-1 rounded-lg" onPress={onDecline} action="negative" size="lg">
          <ButtonIcon as={X} />
          <ButtonText className="ml-2">{t(declineLabel)}</ButtonText>
        </Button>
      </HStack>
    </Box>
  )
}

export default CrewActionButtons
