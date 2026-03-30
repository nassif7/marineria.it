import { FC, memo, useMemo } from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { Box, VStack, HStack, Heading, Text, Icon, Badge, BadgeText } from '@/lib/components/ui'
import { MapPin, Phone, Mail, MessageCircle, Contact, Smartphone } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection, Section, SectionHeader } from '@/components/appUI'
import { TCrew } from '@/api/types'
import { faker } from '@faker-js/faker'

const ContactSection: FC<{ crew: TCrew }> = ({ crew }) => {
  const { t } = useTranslation('crew')
  const contacts = useMemo(
    () =>
      [
        {
          key: 'cellular',
          label: t('cellular'),
          value: crew.cellular,
          icon: Smartphone,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () => crew.cellular && Linking.openURL(`tel:${crew.cellular}`),
        },
        {
          key: 'telephone',
          label: t('phone'),
          value: crew.telephone,
          icon: Phone,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () => crew.telephone && Linking.openURL(`tel:${crew.telephone}`),
        },
        {
          key: 'whatsapp',
          label: t('whatsapp'),
          value: crew.callWhatsapp,
          icon: MessageCircle,
          color: 'text-success-600',

          border: 'border-success-600',
          onPress: () => crew.callWhatsapp && Linking.openURL(`https://wa.me/${crew.callWhatsapp.replace(/\D/g, '')}`),
          green: true,
        },
        {
          key: 'email',
          label: t('email'),
          value: crew.email,
          icon: Mail,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () => crew.email && Linking.openURL(`mailto:${crew.email}`),
        },
      ].filter((c) => c.value),
    [crew]
  )

  return (
    <Section>
      <SectionHeader title={t('contact-information')} icon={Contact} />

      {contacts.length === 0 ? (
        <Badge action="error" variant="outline" className="rounded-md self-start mb-2">
          <BadgeText className="text-error-900">{t('no-contacts')}</BadgeText>
        </Badge>
      ) : (
        <>
          <VStack space="xs">
            <SubSection title={t('address')} icon={MapPin}>
              <Text size="sm" shade={800}>
                {crew.city}, {crew.province} {crew.zip_code} {crew.address}
              </Text>
            </SubSection>

            {contacts.map((c, i) => (
              <SubSection key={c.key} onPress={c.onPress} className="">
                <HStack className="items-center ">
                  <VStack className="flex-1">
                    <Text size="sm" semiBold className={c.green ? 'text-success-600' : 'text-typography-800'}>
                      {c.value}
                    </Text>
                  </VStack>
                  <Box className={`w-8 h-8 rounded-lg items-center justify-center `}>
                    <Icon as={c.icon} size="sm" className={c.green ? 'text-success-600' : 'text-primary-500'} />
                  </Box>
                </HStack>
              </SubSection>
            ))}
          </VStack>
        </>
      )}
    </Section>
  )
}

export default memo(ContactSection)

ContactSection.displayName = 'ContactSection'
