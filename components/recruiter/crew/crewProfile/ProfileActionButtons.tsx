import { FC, memo } from 'react'
import { HStack, Button, ButtonText, ButtonIcon, ButtonSpinner, VStack } from '@/components/ui'
import { UserX, Phone, Contact, PhoneCall, UserCheck } from 'lucide-react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'

interface IProfileActionButtonsProps {
  onGetContact: () => void
  onRemove: () => void
  isLoading?: boolean
}

const ProfileActionButtons: FC<IProfileActionButtonsProps> = ({ onGetContact, onRemove, isLoading }) => {
  const { t } = useTranslation('crew-screen')
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(40).stiffness(150)}
      exiting={FadeOutDown.springify().damping(40).stiffness(150)}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 12,
      }}
    >
      <VStack space="sm">
        <Button
          size="md"
          action="positive"
          variant="solid"
          className="flex-1 rounded-md"
          onPress={onGetContact}
          isDisabled={isLoading}
        >
          {isLoading ? <ButtonSpinner /> : <ButtonIcon as={UserCheck} className="mr-2 text-white" />}
          <ButtonText>{t('contact-crew')}</ButtonText>
        </Button>

        <Button
          size="md"
          action="negative"
          variant="outline"
          className="flex-1 rounded-md border-error-300"
          onPress={onRemove}
          isDisabled={isLoading}
        >
          {isLoading ? <ButtonSpinner /> : <ButtonIcon as={UserX} className="mr-2 text-error-600" />}
          <ButtonText className="text-error-600">{t('remove-crew')}</ButtonText>
        </Button>
      </VStack>
    </Animated.View>
  )
}

export default memo(ProfileActionButtons)

ProfileActionButtons.displayName = 'ProfileActionButtons'
