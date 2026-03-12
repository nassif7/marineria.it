import { FC, memo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Button,
  ButtonText,
  ButtonIcon,
  Divider,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from '@/components/ui'
import { CreditCard } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface IContactModalUnpaid {
  visible: boolean
  onClose: () => void
  onCheckout: () => void
}

const ContactModalUnpaid: FC<IContactModalUnpaid> = ({ visible, onClose, onCheckout }) => {
  const { t } = useTranslation(['crew-screen'])

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-full mb-0 mt-auto rounded-t-md overflow-hidden p-0">
        <ModalBody className="p-0">
          <Box className="items-center pb-1">
            <Box className="w-20 h-1 rounded-full bg-outline-200" />
          </Box>
          <VStack className="px-4 pt-6 pb-4" space="md">
            <Heading size="md" className="text-typography-900">
              {t('search-not-paid-title')}
            </Heading>
            <Divider className="bg-outline-200" />
            <HStack className="bg-background-50 border border-error-300 rounded-md p-4 gap-3 items-start">
              <VStack space="xs" className="flex-1">
                <Text size="sm" bold shade={800}>
                  {t('search-not-paid-description')}
                </Text>
                <Text size="sm" bold className="text-primary-500">
                  {t('search-not-paid-cta')}
                </Text>
              </VStack>
            </HStack>
          </VStack>
          <HStack space="sm" className="px-4 pb-10 pt-1">
            <Button size="md" action="secondary" variant="outline" className="flex-1 rounded-md" onPress={onClose}>
              <ButtonText className="text-typography-600">{t('close')}</ButtonText>
            </Button>
            <Button size="md" action="positive" variant="solid" className="flex-1 rounded-md" onPress={onCheckout}>
              <ButtonIcon as={CreditCard} className=" text-white" />
              <ButtonText>{t('proceed-to-checkout')}</ButtonText>
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(ContactModalUnpaid)

ContactModalUnpaid.displayName = 'ContactModalUnpaid'
