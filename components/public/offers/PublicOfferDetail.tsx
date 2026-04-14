import { useState } from 'react'
import { ScrollView } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useLocalSearchParams, router } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { TOffer } from '@/api/types'
import { ErrorMessage, ScreenContainer } from '@/components/appUI'
import OfferHeader from '@/components/pro/offers/offerDetails/OfferHeader'
import OfferContract from '@/components/pro/offers/offerDetails/OfferContract'
import OfferPosition from '@/components/pro/offers/offerDetails/OfferPosition'
import PublicOfferActions from './PublicOfferActions'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Heading,
  Text,
  Button,
  ButtonText,
  Box,
  Icon,
  Link,
  LinkText,
} from '@/components/ui'
import { X } from 'lucide-react-native'

const PublicOfferDetail = () => {
  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const queryClient = useQueryClient()
  const [showApplyModal, setShowApplyModal] = useState(false)
  const { t } = useTranslation(['offer-screen', 'login-screen', 'settings-screen'])

  const offers = queryClient.getQueryData<TOffer[]>(['public-offers'])
  const offer = offers?.find((o) => String(o.idoffer) === offerId)

  if (!offer) return <ErrorMessage />

  return (
    <ScreenContainer>
      <ScrollView>
        <OfferHeader offer={offer} />
        <OfferContract offer={offer} />
        <OfferPosition offer={offer} />
        <PublicOfferActions offer={offer} onApply={() => setShowApplyModal(true)} />
      </ScrollView>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)}>
        <ModalBackdrop />
        <ModalContent className="w-full mb-0 mt-auto rounded-t-md p-4">
          <ModalHeader className="justify-between items-center">
            <Heading size="xl" className="text-primary-600 flex-1">
              {t('login-to-apply-title', { ns: 'offer-screen' })}
            </Heading>
            <ModalCloseButton onPress={() => setShowApplyModal(false)}>
              <Icon as={X} className="text-typography-500" size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text className="text-typography-600 text-base">
              {t('login-to-apply-description', { ns: 'offer-screen' })}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box className="w-full gap-3">
              <Button
                size="md"
                className="w-full rounded-xl"
                onPress={() => {
                  setShowApplyModal(false)
                  router.replace('/sign-in')
                }}
              >
                <ButtonText>{t('login', { ns: 'settings-screen' })}</ButtonText>
              </Button>
              <Box className="items-center gap-2">
                <Link onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')}>
                  <LinkText>{t('register-as-crew', { ns: 'login-screen' })}</LinkText>
                </Link>
                <Link onPress={() => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')}>
                  <LinkText>{t('register-as-recruiter', { ns: 'login-screen' })}</LinkText>
                </Link>
              </Box>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScreenContainer>
  )
}

export default PublicOfferDetail
