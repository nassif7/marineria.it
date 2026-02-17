// components/offers/ApplyModal.tsx
import React, { useState } from 'react'
import { Modal } from 'react-native'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  Pressable,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/components/ui'
import { X, Check } from 'lucide-react-native'

interface ApplyModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (privacyAccepted: boolean, consentAccepted: boolean) => void
}

const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, onConfirm }) => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)

  const handleApply = () => {
    if (privacyAccepted && consentAccepted) {
      onConfirm(privacyAccepted, consentAccepted)
      // Reset checkboxes
      setPrivacyAccepted(false)
      setConsentAccepted(false)
    }
  }

  const handleClose = () => {
    setPrivacyAccepted(false)
    setConsentAccepted(false)
    onClose()
  }

  const canApply = privacyAccepted && consentAccepted

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={handleClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box className="bg-white rounded-t-3xl p-6">
            <VStack className="gap-4">
              {/* Header */}
              <HStack className="justify-between items-center">
                <Heading size="xl" className="text-primary-600 flex-1">
                  Confirm Application
                </Heading>
                <Pressable onPress={handleClose}>
                  <Icon as={X} className="text-typography-500" size="md" />
                </Pressable>
              </HStack>

              {/* Privacy Checkbox */}
              <Checkbox
                value="privacy"
                isChecked={privacyAccepted}
                onChange={setPrivacyAccepted}
                aria-label="Privacy Policy"
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={Check} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-3">
                  <Text className="text-typography-900 text-sm">
                    I have read and accept the <Text className="text-primary-600 font-semibold">Privacy Policy</Text>
                  </Text>
                </CheckboxLabel>
              </Checkbox>

              {/* Consent Checkbox */}
              <Checkbox
                value="consent"
                isChecked={consentAccepted}
                onChange={setConsentAccepted}
                aria-label="Data Processing Consent"
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={Check} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-3">
                  <Text className="text-typography-900 text-sm">
                    I consent to the processing of my personal data for this job application
                  </Text>
                </CheckboxLabel>
              </Checkbox>

              {/* Info Box */}
              <Box className="bg-info-50 border border-info-200 rounded-lg p-3">
                <Text className="text-info-900 text-xs">
                  By applying, your CV and profile information will be shared with the employer.
                </Text>
              </Box>

              {/* Action Buttons */}
              <HStack className="gap-3 mt-2">
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  className="rounded-xl flex-1"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>

                <Button
                  size="lg"
                  variant="solid"
                  action="positive"
                  onPress={handleApply}
                  isDisabled={!canApply}
                  className="rounded-xl flex-1"
                >
                  <ButtonText>Apply Now</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default ApplyModal
