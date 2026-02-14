// crewDetails/ContactsCard.tsx
import React from 'react'
import { Linking } from 'react-native'
import { Box, VStack, HStack, Button, ButtonText, ButtonIcon, Icon, Text, Heading, Pressable } from '@/components/ui'
import { Phone, Mail, MessageCircle, X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

interface ContactsCardProps {
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
}

const ContactsCard: React.FC<ContactsCardProps> = ({ email, phone, whatsapp }) => {
  const { t } = useTranslation()

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`)
    }
  }

  const handleEmail = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`)
    }
  }

  const handleWhatsApp = () => {
    if (whatsapp) {
      Linking.openURL(whatsapp)
    }
  }

  return (
    <Box className="bg-white border-t border-outline-100 p-4 shadow-2xl">
      <VStack className="gap-4">
        {/* Header */}
        <HStack className="justify-between items-center">
          <Heading size="lg" className="text-primary-600">
            {t('crew.contact-information')}
          </Heading>
        </HStack>

        {/* Contact Buttons */}
        <VStack className="gap-3">
          {/* Phone */}
          {phone && (
            <Button size="lg" variant="outline" action="secondary" onPress={handleCall} className="rounded-xl">
              <ButtonIcon as={Phone} />
              <VStack className="ml-3 flex-1 items-start">
                <Text className="text-xs text-typography-500">{t('crew.phone')}</Text>
                <Text className="font-semibold text-typography-900">{phone}</Text>
              </VStack>
            </Button>
          )}

          {/* Email */}
          {email && (
            <Button size="lg" variant="outline" action="secondary" onPress={handleEmail} className="rounded-xl">
              <ButtonIcon as={Mail} />
              <VStack className="ml-3 flex-1 items-start">
                <Text className="text-xs text-typography-500">{t('crew.email')}</Text>
                <Text className="font-semibold text-typography-900">{email}</Text>
              </VStack>
            </Button>
          )}

          {/* WhatsApp */}
          {whatsapp && (
            <Button
              size="lg"
              variant="solid"
              action="positive"
              onPress={handleWhatsApp}
              className="rounded-xl bg-success-600"
            >
              <ButtonIcon as={MessageCircle} />
              <ButtonText className="ml-2">{t('crew.whatsapp')}</ButtonText>
            </Button>
          )}

          {/* No contacts available */}
          {!phone && !email && !whatsapp && (
            <Box className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <Text className="text-warning-900 text-center">{t('crew.no-contact-available')}</Text>
            </Box>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}

export default ContactsCard
