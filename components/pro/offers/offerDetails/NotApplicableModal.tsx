// components/offers/NotApplicableModal.tsx
import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  HStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/lib/components/ui'
import { X, AlertCircle } from 'lucide-react-native'

interface NotApplicableModalProps {
  visible: boolean
  onClose: () => void
  reasons: string[]
}

const NotApplicableModal: React.FC<NotApplicableModalProps> = ({ visible, onClose, reasons }) => {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-full rounded-md mb-0 mt-auto">
        <ModalHeader className="justify-between items-center">
          <HStack className="items-center gap-2 flex-1">
            <Icon as={AlertCircle} className="text-warning-600" size="xl" />
            <Heading size="xl" className="text-warning-600">
              Not matching! Why?
            </Heading>
          </HStack>
          <ModalCloseButton onPress={onClose}>
            <Icon as={X} className="text-typography-500" size="md" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack className="gap-3">
            {reasons.length > 0 ? (
              reasons.map((reason, index) => (
                <Box key={index} className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <Text className="text-warning-900 text-sm">• {reason}</Text>
                </Box>
              ))
            ) : (
              <Box className="bg-background-50 rounded-lg p-4">
                <Text className="text-typography-700 text-sm text-center">
                  This offer doesn't match your profile requirements.
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button size="md" variant="outline" action="secondary" onPress={onClose} className="rounded-xl flex-1">
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NotApplicableModal
