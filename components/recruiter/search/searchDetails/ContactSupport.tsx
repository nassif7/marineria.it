// components/offers/NotApplicableModal.tsx
import React from 'react'
import { Modal } from 'react-native'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  Pressable,
  HStack,
  Popover,
  PopoverBody,
  PopoverBackdrop,
  PopoverContent,
  ButtonIcon,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui'
import { X, AlertCircle, MessageCircleQuestionMark, ChevronDownIcon, EditIcon } from 'lucide-react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useTranslation } from 'react-i18next'

const ContactSupport: React.FC = () => {
  const { t } = useTranslation()
  const [show, setShow] = React.useState(false)

  return (
    <>
      <Button size="lg" variant="outline" action="secondary" onPress={() => setShow(true)} className="rounded-md">
        <ButtonIcon as={MessageCircleQuestionMark} />
        <ButtonText className="ml-2">{t('need-support')}</ButtonText>
      </Button>
      <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setShow(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Box className="bg-white rounded-t-md p-4 pb-40">
              <VStack space="md">
                <HStack className="justify-between items-center">
                  <HStack className="items-center gap-2 flex-1">
                    <Icon as={MessageCircleQuestionMark} className="text-warning-600" size="xl" />
                    <Heading size="xl" className="text-primary-600 flex-1">
                      Contact Support!
                    </Heading>
                    <Pressable onPress={() => setShow(false)}>
                      <Icon as={X} className="text-typography-500" size="md" />
                    </Pressable>
                  </HStack>
                </HStack>

                <HStack className="w-full items-center justify-between">
                  <HStack space="lg" className="flex-1 items-center">
                    <Avatar>
                      <AvatarFallbackText>MC</AvatarFallbackText>
                      {/* <AvatarImage
                        source={{
                          uri: 'https://i.ibb.co/7R4DyhQ/Avatar-1.jpg',
                        }}
                        alt="Michele Costabile "
                      /> */}
                    </Avatar>
                    <VStack>
                      <Text size="sm" className="font-semibold text-typography-900">
                        Michele Costabile
                      </Text>
                      <Text size="xs">costabile.michele@gmail.com</Text>
                    </VStack>
                  </HStack>
                  <HStack space="md">
                    <FontAwesome6 name="whatsapp" size={24} color="black" />

                    <FontAwesome6 name="telegram" size={24} color="rgb(115, 115, 115)" />
                  </HStack>
                </HStack>

                <HStack className="w-full items-center justify-between">
                  <HStack space="lg" className="flex-1 items-center">
                    <Avatar>
                      <AvatarFallbackText>ER</AvatarFallbackText>
                      {/* <AvatarImage
                        source={{
                          uri: 'https://i.ibb.co/7R4DyhQ/Avatar-1.jpg',
                        }}
                        alt="Michele Costabile "
                      /> */}
                    </Avatar>
                    <VStack>
                      <Text size="sm" className="font-semibold text-typography-900">
                        Elisa Rossi
                      </Text>
                      <Text size="xs">rossi.elisa@gmail.com</Text>
                    </VStack>
                  </HStack>
                  <HStack space="md">
                    <FontAwesome6 name="whatsapp" size={24} color="black" />
                    <FontAwesome6 name="telegram" size={24} color="rgb(115, 115, 115)" />
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </Pressable>
        </Pressable>
      </Modal>

      {/* <VStack className="gap-4">

        <HStack className="justify-between items-center">
          <HStack className="items-center gap-2 flex-1">
            <Icon as={MessageCircleQuestionMark} className="text-warning-600" size="xl" />
            <Heading size="xl" className="text-warning-600">
              {t('contact-support')}
            </Heading>
          </HStack>
          <Pressable onPress={() => setShow(false)}>
            <Icon as={X} className="text-typography-500" size="md" />
          </Pressable>
        </HStack>


        <VStack space="sm">
          <HStack>
            <Text size="md" shade={600}>
              WhatsApp
            </Text>
            <FontAwesome6 name="whatsapp" size={32} />
          </HStack>
          <HStack>
            <Text size="md" shade={600}>
              Telegram
            </Text>
            <FontAwesome6 name="telegram" size={32} />
          </HStack>
        </VStack>


        <Button size="lg" variant="outline" action="secondary" onPress={() => setShow(false)} className="rounded-xl">
          <ButtonText>{t('close')}</ButtonText>
        </Button>
      </VStack> */}
    </>
  )
}

export default ContactSupport
