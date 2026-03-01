import { FC, useState, useMemo, useRef, useEffect } from 'react'
import Reanimated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import {
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
  FlatList,
  useWindowDimensions,
  View as RNView,
  Image as RNImage,
} from 'react-native'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Image,
  Badge,
  BadgeText,
  BadgeIcon,
  Button,
  ButtonText,
  ButtonIcon,
  Divider,
} from '@/components/ui'
import {
  User,
  Calendar,
  MapPin,
  Award,
  Heart,
  Cake,
  Cigarette,
  IdCard,
  Briefcase,
  Phone,
  Mail,
  MessageCircle,
  Link,
  Star,
  Globe,
  BookOpen,
  Anchor,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Expand,
  X,
  Images,
  UserX,
  PhoneCall,
  Check,
  FileText,
  Unlock,
  Send,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SubSection } from '@/components/appUI'
import { getAgeByYear } from '@/utils/dateUtils'
import { TCrew } from '@/api/types'

// interface IContactModalProps {
//   visible: boolean
//   crew: TCrew
//   onClose: () => void
//   onConfirm: (requestPdf: boolean) => void
// }

interface IContactModal {
  visible: boolean
  crew: TCrew
  onClose: () => void
  onConfirm: (requestPdf: boolean) => void
}

const ContactModal: FC<IContactModal> = ({ visible, crew, onClose, onConfirm }) => {
  const [requestPdf, setRequestPdf] = useState(false)

  const photoUrl = `https://www.comunicazione.it/PROFoto/${crew?.userPhoto}`

  const benefits = [
    { icon: Unlock, label: 'Unlock contact information', color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: FileText, label: 'Receive their CV by email as PDF', color: 'text-warning-600', bg: 'bg-warning-50' },
    { icon: Send, label: 'Send your job offer directly', color: 'text-success-600', bg: 'bg-success-50' },
  ]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box className="bg-white rounded-t-3xl overflow-hidden">
            {/* Drag handle */}
            <Box className="items-center pt-3 pb-1">
              <Box className="w-10 h-1 rounded-full bg-outline-200" />
            </Box>

            {/* Header with avatar */}
            <VStack className="items-center px-5 pt-3 pb-5">
              <Box className="w-16 h-16 rounded-2xl bg-primary-100 overflow-hidden border-2 border-primary-200 mb-3">
                {crew.userPhoto ? (
                  <RNImage source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Box className="flex-1 items-center justify-center">
                    <Icon as={User} size="xl" className="text-primary-400" />
                  </Box>
                )}
              </Box>
              {/* <Heading size="md" className="text-typography-900 text-center">
                Contact this candidate
              </Heading>
              <Text size="sm" className="text-typography-500 text-center mt-0.5">
                {crew.firstName} {crew.lastName} · {crew.mainPosition}
              </Text> */}
            </VStack>

            {/* Benefits */}
            <VStack space="xs" className="mx-4 mb-4">
              {benefits.map((b, i) => (
                <HStack
                  key={i}
                  space="sm"
                  className="items-center bg-background-50 rounded-xl px-4 py-3 border border-outline-100"
                >
                  <Box className={`w-8 h-8 rounded-full items-center justify-center ${b.bg}`}>
                    <Icon as={b.icon} size="sm" className={b.color} />
                  </Box>
                  <Text size="sm" bold className="text-typography-800 flex-1">
                    {b.label}
                  </Text>
                  <Icon as={Check} size="xs" className="text-success-500" />
                </HStack>
              ))}
            </VStack>

            <Divider className="bg-outline-100 mx-4" />

            {/* Search tag — always selected */}
            <Box className="mx-4 mt-3 mb-1">
              <Text size="xs" bold className="text-typography-400 uppercase tracking-widest mb-2">
                Sending for
              </Text>
              <HStack space="sm" className="items-center bg-primary-50 rounded-xl px-4 py-3 border border-primary-200">
                <Box className="w-5 h-5 rounded bg-primary-500 items-center justify-center">
                  <Icon as={Check} size="xs" className="text-white" />
                </Box>
                <Text size="sm" bold className="text-primary-700 flex-1">
                  {crew.mainPosition} · {crew.company ?? 'your search'}
                </Text>
              </HStack>
            </Box>

            {/* PDF toggle */}
            <TouchableOpacity activeOpacity={0.7} className="mx-4 mt-2 mb-4" onPress={() => setRequestPdf((v) => !v)}>
              <HStack
                space="sm"
                className={`items-center rounded-xl px-4 py-3 border ${
                  requestPdf ? 'bg-warning-50 border-warning-200' : 'bg-background-50 border-outline-100'
                }`}
              >
                <Box
                  className={`w-5 h-5 rounded border items-center justify-center ${
                    requestPdf ? 'bg-warning-500 border-warning-500' : 'bg-white border-outline-300'
                  }`}
                >
                  {requestPdf && <Icon as={Check} size="xs" className="text-white" />}
                </Box>
                <VStack className="flex-1">
                  <Text size="sm" bold className={requestPdf ? 'text-warning-700' : 'text-typography-800'}>
                    Also request CV in PDF
                  </Text>
                  <Text size="xs" className="text-typography-400">
                    Longer waiting time
                  </Text>
                </VStack>
                <Icon as={FileText} size="sm" className={requestPdf ? 'text-warning-500' : 'text-typography-300'} />
              </HStack>
            </TouchableOpacity>

            {/* Footer buttons */}
            <HStack space="sm" className="px-4 pb-10 pt-1">
              <Button size="lg" action="secondary" variant="outline" className="flex-1 rounded-xl" onPress={onClose}>
                <ButtonText className="text-typography-600">Cancel</ButtonText>
              </Button>
              <Button
                size="lg"
                action="positive"
                variant="solid"
                className="flex-1 rounded-xl"
                onPress={() => onConfirm(requestPdf)}
              >
                <ButtonIcon as={PhoneCall} className="mr-1.5 text-white" />
                <ButtonText>Yes, Contact</ButtonText>
              </Button>
            </HStack>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
export default ContactModal
