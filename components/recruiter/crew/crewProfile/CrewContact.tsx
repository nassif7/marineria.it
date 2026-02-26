import { FC, useMemo } from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { Box, VStack, HStack, Heading, Text, Icon } from '@/components/ui'
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
          value: crew.cellular || faker.phone.number(),
          icon: Smartphone,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () =>
            (crew.cellular || faker.phone.number()) && Linking.openURL(`tel:${crew.cellular || faker.phone.number()}`),
        },
        {
          key: 'telephone',
          label: t('phone'),
          value: crew.telephone || faker.phone.number(),
          icon: Phone,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () =>
            (crew.telephone || faker.phone.number()) &&
            Linking.openURL(`tel:${crew.telephone || faker.phone.number()}`),
        },
        {
          key: 'whatsapp',
          label: t('whatsapp'),
          value: crew.callWhatsapp || faker.phone.number(),
          icon: MessageCircle,
          color: 'text-success-600',

          border: 'border-success-600',
          onPress: () =>
            (crew.callWhatsapp || faker.phone.number()) &&
            Linking.openURL(`https://wa.me/${(crew.callWhatsapp || faker.phone.number()).replace(/\D/g, '')}`),
          green: true,
        },
        {
          key: 'email',
          label: t('email'),
          value: crew.email || faker.internet.email(),
          icon: Mail,
          color: 'text-primary-600',

          border: 'border-primary-600',
          onPress: () =>
            (crew.email || faker.internet.email()) &&
            Linking.openURL(`mailto:${crew.callWhatsapp || faker.phone.number()}`),
        },
      ].filter((c) => c.value),
    [crew]
  )

  return (
    <Section>
      <SectionHeader title={t('contact-information')} icon={Contact} />

      {contacts.length === 0 ? (
        <Text size="sm" semiBold shade={800}>
          {t('no-contacts')}
        </Text>
      ) : (
        <>
          <VStack space="xs">
            {(crew.address || crew.city) && (
              <SubSection title={t('address')} icon={MapPin}>
                <Text size="sm" shade={800}>
                  {crew.city}, {crew.province} {crew.zip_code} {crew.address}
                </Text>
              </SubSection>
            )}

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
            {/* <Box className="flex flex-row justify-between">
              {contacts.map((c) => (
                <TouchableOpacity key={c.key} onPress={c.onPress} activeOpacity={0.7} className="items-center gap-1.5">
                  <Icon as={c.icon} size="lg" className={`${c.color}`} strokeWidth={2.5} />

                  <Text size="xs">{c.label}</Text>
                </TouchableOpacity>
              ))}
            </Box> */}
          </VStack>
        </>
      )}
    </Section>
  )
}

export default ContactSection
