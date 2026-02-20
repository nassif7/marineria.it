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
import { X, Check, ShieldUser, ListCheck, CircleDot, CircleSmall, Minus, MinusCircle } from 'lucide-react-native'
import { Section, SubSection, SubSectionHeader } from '@/components/appUI'

interface ApplyModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (consentAccepted: boolean) => void
}

const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, onConfirm }) => {
  const [consentAccepted, setConsentAccepted] = useState(false)

  const handleApply = () => {
    if (consentAccepted) {
      onConfirm(consentAccepted)
      // Reset checkboxes

      setConsentAccepted(false)
    }
  }

  const handleClose = () => {
    setConsentAccepted(false)
    onClose()
  }

  const canApply = consentAccepted

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/80 justify-end" onPress={handleClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box className="bg-white rounded-md p-4 pb-20">
            <VStack className="gap-2">
              <HStack className="justify-between items-center">
                <Heading size="xl" className="text-primary-600 flex-1">
                  Confirm Application
                </Heading>
                <Pressable onPress={handleClose}>
                  <Icon as={X} className="text-typography-500" size="md" />
                </Pressable>
              </HStack>
              <Section>
                <VStack className="gap-2">
                  <SubSection className="p-4">
                    <SubSectionHeader icon={ShieldUser} title="Privacy" />
                    <Text size="sm" shade={800}>
                      I am seriousley interested in this job offer for which I wish my curriculum and my personal
                      details to be shared with the employer posting the ad as is in compliance with the provision of
                      the italian Law n.196 30.06.2003 art.7 and art.13 enforced from 04.01.2004 onward.
                    </Text>
                  </SubSection>
                  <SubSection className="p-4 overflow-hidden max-w-full">
                    <SubSectionHeader icon={ListCheck} title="Compliance:" />
                    <Checkbox
                      value="consent"
                      isChecked={consentAccepted}
                      onChange={setConsentAccepted}
                      aria-label="Data Processing Consent"
                    >
                      <HStack>
                        <CheckboxIndicator>
                          <CheckboxIcon as={Check} />
                        </CheckboxIndicator>
                        <VStack className="ml-3 gap-1 text-typography-900 text-sm flex-shrink max-w-[90%]">
                          <HStack className="items-center gap-1">
                            <Icon as={Minus} size="xs" className="text-typography-800" />
                            <Text size="sm" shade={800}>
                              terms and conditions
                            </Text>
                          </HStack>
                          <HStack className="g  ap-1">
                            <Icon as={Minus} size="xs" className="text-typography-800" />
                            <Text size="sm" shade={800}>
                              I am available for hire during the time period specified by the advert
                            </Text>
                          </HStack>
                          <HStack className="items-center gap-1">
                            <Icon as={Minus} size="xs" className="text-typography-800" />
                            <Text size="sm" shade={800}>
                              I satisfy the requirements
                            </Text>
                          </HStack>
                          <Text size="sm" color="primary" shade={600}>
                            Click to check your profile
                          </Text>
                        </VStack>
                      </HStack>
                    </Checkbox>
                  </SubSection>
                </VStack>
              </Section>

              {/* Action Buttons */}
              <HStack className="gap-3 mt-2">
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  className="rounded-md flex-1"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>

                <Button
                  size="lg"
                  variant="solid"
                  action="positive"
                  onPress={handleApply}
                  isDisabled={!canApply}
                  className="rounded-md flex-1"
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
