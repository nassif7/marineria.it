// components/offers/NotApplicableModal.tsx
import React from 'react'
import { Modal } from 'react-native'
import { Box, VStack, Heading, Text, Button, ButtonText, Icon, Pressable, HStack } from '@/components/ui'
import { X, AlertCircle } from 'lucide-react-native'

interface NotApplicableModalProps {
  visible: boolean
  onClose: () => void
  reasons: string[]
}

const NotApplicableModal: React.FC<NotApplicableModalProps> = ({ visible, onClose, reasons }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box className="bg-white rounded-t-3xl p-6">
            <VStack className="gap-4">
              {/* Header */}
              <HStack className="justify-between items-center">
                <HStack className="items-center gap-2 flex-1">
                  <Icon as={AlertCircle} className="text-warning-600" size="lg" />
                  <Heading size="xl" className="text-warning-600">
                    Why can't I apply?
                  </Heading>
                </HStack>
                <Pressable onPress={onClose}>
                  <Icon as={X} className="text-typography-500" size="md" />
                </Pressable>
              </HStack>

              {/* Reasons List */}
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

              {/* Close Button */}
              <Button size="lg" variant="outline" action="secondary" onPress={onClose} className="rounded-xl">
                <ButtonText>Close</ButtonText>
              </Button>
            </VStack>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default NotApplicableModal
