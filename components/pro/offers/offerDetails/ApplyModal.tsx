import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  Link,
  LinkText,
  ButtonSpinner,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/lib/components/ui'
import { X, Check, ShieldUser, ListCheck, Minus } from 'lucide-react-native'
import { SubSection, SubSectionHeader } from '@/lib/components'
import { useTranslation } from 'react-i18next'
import { useUser } from '@/Providers/UserProvider'

interface ApplyModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, onConfirm, isSubmitting }) => {
  const [consentAccepted, setConsentAccepted] = useState(false)
  const {
    t,
    i18n: { language },
  } = useTranslation()

  const { user } = useUser()
  const userId = user?.iduser

  const handleApply = () => {
    if (consentAccepted) {
      onConfirm()
      setConsentAccepted(false)
    }
  }

  const handleClose = () => {
    setConsentAccepted(false)
    onClose()
  }

  const canApply = consentAccepted

  return (
    <Modal isOpen={visible} onClose={handleClose}>
      <ModalBackdrop />
      <ModalContent className="w-full mb-0 mt-auto rounded-t-md overflow-hidden p-4 max-h-[85%]">
        <ModalHeader className="justify-between items-center">
          <Heading size="xl" className="text-primary-600 flex-1">
            Confirm Application
          </Heading>
          <ModalCloseButton onPress={handleClose}>
            <Icon as={X} className="text-typography-500" size="md" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <VStack className="gap-2">
            <SubSection className="p-4">
              <SubSectionHeader icon={ShieldUser} title={t('privacy', { ns: 'offer-screen' })} />
              <Text size="sm" shade={800}>
                {t('privacy-policy', { ns: 'offer-screen' })}
              </Text>
            </SubSection>

            <SubSection className="p-4 overflow-hidden max-w-full">
              <SubSectionHeader icon={ListCheck} title={t('compliance', { ns: 'offer-screen' })} />
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
                    <Text size="sm" shade={800}>
                      {t('i-declare', { ns: 'offer-screen' })}:
                    </Text>
                    <HStack className="items-center gap-1">
                      <Icon as={Minus} size="xs" className="text-typography-800" />
                      <Text size="sm" shade={800}>
                        {t('agree-to-policy', { ns: 'offer-screen' })}
                      </Text>
                    </HStack>
                    <HStack className="gap-1">
                      <Icon as={Minus} size="xs" className="text-typography-800" />
                      <Text size="sm" shade={800}>
                        {t('confirm-availability', { ns: 'offer-screen' })}
                      </Text>
                    </HStack>
                    <HStack className="items-center gap-1">
                      <Icon as={Minus} size="xs" className="text-typography-800" />
                      <Text size="sm" shade={800}>
                        {t('confirm-requirements', { ns: 'offer-screen' })}
                      </Text>
                    </HStack>
                    <Link href={`https://www.marineria.it/${language}/CV.aspx?idutente=${userId}`}>
                      <LinkText className="text-primary-600">
                        {t('review-your-profile', { ns: 'offer-screen' })}
                      </LinkText>
                    </Link>
                  </VStack>
                </HStack>
              </Checkbox>
            </SubSection>
          </VStack>
        </ModalBody>

        <ModalFooter className="gap-3">
          <Button size="md" variant="outline" action="secondary" onPress={handleClose} className="rounded-md flex-1">
            <ButtonText>{t('cancel')}</ButtonText>
          </Button>

          <Button
            size="md"
            variant="solid"
            action="positive"
            onPress={handleApply}
            isDisabled={!canApply || isSubmitting}
            className="rounded-md flex-1"
          >
            {isSubmitting && <ButtonSpinner color="white" />}
            <ButtonText>{t('apply', { ns: 'offer-screen' })}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ApplyModal

ApplyModal.displayName = 'ApplyModal'
