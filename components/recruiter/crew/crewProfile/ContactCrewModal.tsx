import { FC, memo, useState } from 'react'
import { TouchableOpacity, Image as RNImage } from 'react-native'
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
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from '@/components/ui'
import { User, Unlock, FileText, Send, Check, PhoneCall, ReceiptEuro } from 'lucide-react-native'
import { SubSection } from '@/components/appUI'
import { TCrew } from '@/api/types'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import ContactSupport from '@/components/common/ContactSupport'
import { supportTeam } from '@/api'
import { useRecruiterSearch } from '@/Providers/RecruiterSearchProvider'

interface IContactModal {
  visible: boolean
  crew: TCrew
  onClose: () => void
  onConfirm: () => void
}

const ContactModal: FC<IContactModal> = ({ visible, crew, onClose, onConfirm }) => {
  const fakeImage = faker.image.avatar()

  const {
    i18n: { language },
    t,
  } = useTranslation(['crew-screen'])

  const [isConfirmed, setIsConfirmed] = useState(true)
  const [requestPdf, setRequestPdf] = useState(false)

  const benefits = [
    { icon: Unlock, label: t('unlock-contact-information'), color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: FileText, label: t('receive-cv'), color: 'text-primary-600', bg: 'bg-warning-50' },
    { icon: Send, label: t('send-job-offer'), color: 'text-success-600', bg: 'bg-success-50' },
  ]
  const {
    search: { data },
  } = useRecruiterSearch()
  const searchLabel = data?.title
  const isPaid = data?.paid

  if (!isPaid) {
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
                <Icon as={ReceiptEuro} size="md" className="text-error-600 mt-0.5" />
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
              <Button size="md" action="positive" variant="solid" className="flex-1 rounded-md" onPress={console.log}>
                <ButtonIcon as={ReceiptEuro} className="mr-1.5 text-white" />
                <ButtonText>{t('proceed-to-checkout')}</ButtonText>
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-full mb-0 mt-auto rounded-t-md overflow-hidden p-0">
        <ModalBody className="p-0">
          <Box className="items-center pb-1">
            <Box className="w-20 h-1 rounded-full bg-outline-200" />
          </Box>

          <VStack className="items-center pt-4 pb-6">
            <Box className="w-16 h-16 rounded-md bg-primary-100 overflow-hidden border-2 border-primary-200 mb-3">
              {!!crew.userPhoto ? (
                <RNImage source={{ uri: fakeImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Box className="flex-1 items-center justify-center">
                  <Icon as={User} size="xl" className="text-primary-400" />
                </Box>
              )}
            </Box>
            <Heading size="md" className="text-typography-900 text-center">
              {t('contact-crew')}
            </Heading>
            {/* {!isPaid && (
              <HStack className="bg-background-50 border border-error-300 rounded-md p-4 gap-2 items-start mx-4">
                <Icon as={ReceiptEuro} size="md" className="text-error-600" />
                <Text size="md" semiBold className="text-typography-800 ">
                  {t('search-not-paid', { ns: 'crew-screen' })}
                </Text>
                <ContactSupport
                  isTextTrigger
                  supportTeam={supportTeam}
                  title={t('contact-support', { ns: 'common' })}
                />
                <Text size="md" semiBold className="text-typography-800 ">
                  {t('to-proceed', { ns: 'crew-screen' })}
                </Text>
              </HStack>
            )} */}
          </VStack>

          <VStack space="xs" className="mx-4">
            {benefits.map((b, i) => (
              <SubSection key={i}>
                <HStack space="sm" className="items-center">
                  <Box className={`w-8 h-8 rounded-full items-center justify-center ${b.bg}`}>
                    <Icon as={b.icon} size="sm" className={b.color} />
                  </Box>
                  <Text size="sm" bold className="flex-1" shade={800}>
                    {b.label}
                  </Text>
                  <Icon as={Check} size="xs" className="text-success-600" />
                </HStack>
              </SubSection>
            ))}
          </VStack>

          <Divider className="bg-outline-200 mx-4 my-4" />

          <VStack space="xs" className="mx-4 mb-4">
            <SubSection>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setIsConfirmed((v) => !v)}>
                <Checkbox value="search" isChecked={isConfirmed} onChange={(val) => setIsConfirmed(val)}>
                  <CheckboxIndicator className="mr-3">
                    <CheckboxIcon as={Check} />
                  </CheckboxIndicator>
                  <CheckboxLabel>
                    <Text size="sm" bold color="primary">
                      {crew.mainPosition} · {searchLabel}
                    </Text>
                  </CheckboxLabel>
                </Checkbox>
              </TouchableOpacity>
            </SubSection>
            <SubSection>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setRequestPdf((v) => !v)}>
                <Checkbox value="pdf" isChecked={requestPdf} onChange={(val) => setRequestPdf(val)}>
                  <CheckboxIndicator className="mr-3">
                    <CheckboxIcon as={Check} />
                  </CheckboxIndicator>
                  <CheckboxLabel className="flex-1">
                    <VStack>
                      <Text size="sm" bold shade={800}>
                        {t('request-cv-as-pdf')}
                      </Text>
                      <Text size="xs" shade={600}>
                        {t('longer-time')}
                      </Text>
                    </VStack>
                  </CheckboxLabel>
                </Checkbox>
              </TouchableOpacity>
            </SubSection>
          </VStack>

          {/* Footer buttons */}
          <HStack space="sm" className="px-4 pb-10 pt-1">
            <Button size="md" action="secondary" variant="outline" className="flex-1 rounded-md" onPress={onClose}>
              <ButtonText className="text-typography-600">{t('close')}</ButtonText>
            </Button>
            <Button
              size="md"
              action="positive"
              variant="solid"
              className="flex-1 rounded-md"
              onPress={onConfirm}
              isDisabled={!isConfirmed || !isPaid}
            >
              <ButtonIcon as={PhoneCall} className="mr-1.5 text-white" />
              <ButtonText>{t('contact', { ns: 'crew-screen' })}</ButtonText>
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(ContactModal)

ContactModal.displayName = 'ContactModal'
