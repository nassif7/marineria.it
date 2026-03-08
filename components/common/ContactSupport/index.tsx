import React, { FC, useState } from 'react'
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Pressable,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  Box,
  Heading,
  Icon,
} from '@/components/ui'
import { MessageCircle, Send, X, HeadphonesIcon } from 'lucide-react-native'
import { TSupportTeam } from '@/api'
import { Linking } from 'react-native'
import { useTranslation } from 'react-i18next'

type IContactSupportProps = {
  title: string
  supportTeam: TSupportTeam[]
  isTextTrigger?: boolean
}

function SupportMemberCard({ member }: { member: TSupportTeam }) {
  const fullName = `${member.firstName} ${member.lastName}`
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()

  const handleWhatsApp = () => {
    const url = `https://wa.me/${member.whatsApp.replace(/\D/g, '')}`
    Linking.openURL(url)
  }

  const handleTelegram = () => {
    if (!member.telegram) return
    const url = `https://t.me/${member.telegram.replace('@', '')}`
    Linking.openURL(url)
  }

  const handleEmail = () => {
    const url = `mailto:${member.email}`
    Linking.openURL(url)
  }

  return (
    <HStack className="items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
      {/* Avatar + Info */}
      <HStack className="items-center gap-3 flex-1">
        <Box className="relative">
          <Avatar size="md" className="rounded-full">
            {member.photoUrl ? (
              <AvatarImage source={{ uri: member.photoUrl }} />
            ) : (
              <AvatarFallbackText className="text-white text-sm font-bold">{initials}</AvatarFallbackText>
            )}
          </Avatar>
          {/* Online dot */}
          <Box
            className={`absolute bottom-0 right-0 w-3 h-3 bg-${member.isOnline ? 'success' : 'secondary'}-500 rounded-full border-2 border-white dark:border-gray-900`}
          />
        </Box>

        <VStack className="gap-0.5 flex-1">
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-50" numberOfLines={1}>
            {fullName}
          </Text>
          <Pressable onPress={handleEmail}>
            <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>
              {member.email}
            </Text>
          </Pressable>
        </VStack>
      </HStack>

      {/* Action Buttons */}
      <HStack className="gap-2 ml-2">
        {/* WhatsApp */}
        <Pressable
          onPress={member.isOnline ? handleWhatsApp : undefined}
          className={`w-9 h-9 bg-${member.isOnline ? 'success' : 'secondary'}-100  rounded-full items-center justify-center active:opacity-70`}
        >
          <Icon as={MessageCircle} size="sm" className={`text-${member.isOnline ? 'success' : 'secondary'}-600`} />
        </Pressable>

        {/* Telegram */}
        {member.telegram && (
          <Pressable
            onPress={member.isOnline ? handleTelegram : undefined}
            className="w-9 h-9 bg-blue-100  rounded-full items-center justify-center active:opacity-70"
          >
            <Icon as={Send} size="sm" className="text-blue-600" />
          </Pressable>
        )}
      </HStack>
    </HStack>
  )
}

export const ContactSupportIconTrigger: FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800 active:opacity-70"
    >
      <Icon as={HeadphonesIcon} size="md" className="text-primary-600 dark:text-gray-200" />
    </Pressable>
  )
}

export const ContactSupportTextTrigger: FC<{ onPress: () => void }> = ({ onPress }) => {
  const { t } = useTranslation('common')
  return (
    <Pressable onPress={onPress}>
      <Text size="md" bold className="text-primary-600 underline">
        {t('contact-support', { ns: 'common' })}
      </Text>{' '}
    </Pressable>
  )
}

const ContactSupport: FC<IContactSupportProps> = ({ title, supportTeam, isTextTrigger }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isTextTrigger ? (
        <ContactSupportTextTrigger onPress={() => setIsOpen(true)} />
      ) : (
        <ContactSupportIconTrigger onPress={() => setIsOpen(true)} />
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
        <ModalBackdrop />
        <ModalContent className="rounded-t-md dark:bg-gray-900 w-full mb-0 mt-auto">
          {/* Header */}
          <ModalHeader className="border-b-0 pb-0 pt-2 px-2">
            <HStack className="items-center gap-2 flex-1">
              <Box className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                <Icon as={HeadphonesIcon} size="xs" className="text-orange-500" />
              </Box>
              <Heading size="sm" className="text-gray-900 dark:text-gray-50 font-bold">
                {title}
              </Heading>
            </HStack>

            <ModalCloseButton>
              <Box className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center">
                <Icon as={X} size="xs" className="text-gray-600 dark:text-gray-300" />
              </Box>
            </ModalCloseButton>
          </ModalHeader>
          {/* Online status */}
          {/* <HStack className="px-5 pt-2 pb-1 items-center gap-2">
            <Box className="w-2 h-2 bg-green-500 rounded-full" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {supportTeam.length} member{supportTeam.length !== 1 ? 's' : ''} online
            </Text>
          </HStack> */}
          {/* Body */}
          <ModalBody className="px-2 pb-2 pt-2">
            <VStack className="gap-2">
              {supportTeam.map((member, index) => (
                <SupportMemberCard key={index} member={member} />
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ContactSupport

ContactSupport.displayName = 'ContactSupport'
