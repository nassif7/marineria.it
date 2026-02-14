import React, { useMemo } from 'react'
import { CrewType } from '@/api/types'
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Pressable,
  Icon,
} from '@/components/ui'
import { CheckCircle, Calendar, Anchor, MapPin } from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'

const CrewListItem: React.FC<{ crew: CrewType; searchId: string }> = ({ crew, searchId }) => {
  const photoUrl = useMemo(() => `https://www.comunicazione.it/PROFoto/${crew?.userPhoto}`, [crew])
  const fakerImage = useMemo(() => faker.image.personPortrait({ size: 256 }), [crew])

  const {
    i18n: { language },
  } = useTranslation()

  const crewDetailsInfo = useMemo(
    () => ({
      martialStatus: crew.maritalStatus ? 'Married' : 'Single',
      smoker: !!crew.smoker ? 'Non Smoker' : 'Smoker',
      city: crew.city,
      citizenship: crew.passport,
    }),
    [crew]
  )

  return (
    <Pressable key={crew.userId} onPress={() => router.push(`/recruiter/search/${searchId}/crew/${crew.userId}`)}>
      <Box className="bg-white rounded-xl p-4  ">
        <VStack className="gap-3">
          {/* Header: Photo + Name + Status */}
          <HStack className="gap-3 items-center">
            <Avatar className="">
              <AvatarFallbackText>{`${crew.firstName} ${crew.lastName} `}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: fakerImage,
                }}
              />
            </Avatar>

            <VStack className="flex-1 gap-0.5 min-w-0">
              <Heading size="md" className="text-typography-900 break-words">
                {crew.firstName} {crew.lastName}
              </Heading>
              <Text className="text-typography-500 text-xs">ID: {crew.userId}</Text>
            </VStack>

            {crew.selected && (
              <Box className="bg-success-500 rounded-full p-2">
                <Icon as={CheckCircle} className="text-white" size="sm" />
              </Box>
            )}
            {crew.photoApproved && !crew.selected && (
              <Box className="bg-primary-100 rounded-full px-2 py-1">
                <Text className="text-primary-700 text-xs font-bold">✓</Text>
              </Box>
            )}
          </HStack>

          {/* Position */}
          <Box className="bg-primary-500 rounded-lg px-3 py-2">
            <Text className="text-white font-bold text-base">{crew.mainPosition}</Text>
          </Box>

          {/* Quick Info - 3 pills */}
          <HStack className="gap-2 flex-wrap">
            <Box className="bg-background-50 rounded-lg px-3 py-1.5">
              <HStack className="items-center gap-1.5">
                <Icon as={MapPin} className="text-typography-500" size="xs" />
                <Text className="text-typography-900 text-xs font-medium">
                  {crew.city}, {crew.country}
                </Text>
              </HStack>
            </Box>

            <Box className="bg-background-50 rounded-lg px-3 py-1.5">
              <HStack className="items-center gap-1.5">
                <Icon as={Anchor} className="text-typography-500" size="xs" />
                <Text className="text-typography-900 text-xs font-medium">{crew.calculatedExperience}</Text>
              </HStack>
            </Box>

            <Box className="bg-background-50 rounded-lg px-3 py-1.5">
              <HStack className="items-center gap-1.5">
                <Icon as={Calendar} className="text-typography-500" size="xs" />
                <Text className="text-typography-900 text-xs font-medium">{crew.dateAvailability}</Text>
              </HStack>
            </Box>
          </HStack>

          {/* Qualifications - Compact badges */}
          <HStack className="gap-2 flex-wrap">
            {crew.seamansBook && (
              <Box className="bg-success-50 border border-success-200 rounded-full px-2 py-1">
                <Text className="text-success-700 text-xs font-semibold">{crew.seamansBook}</Text>
              </Box>
            )}
            {crew.pos_hotel && (
              <Box className="bg-info-50 border border-info-200 rounded-full px-2 py-1">
                <Text className="text-info-700 text-xs font-semibold">
                  {crew.pos_hotel.split(' ')[0]} {/* First word only */}
                </Text>
              </Box>
            )}
            {crew.courses && (
              <Box className="bg-warning-50 border border-warning-200 rounded-full px-2 py-1">
                <Text className="text-warning-700 text-xs font-semibold">STCW</Text>
              </Box>
            )}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  )
}

export default CrewListItem

// const handleOfferPress = (offerId: string) => {
//   // Navigate to offer details within offers folder
//   router.push(`/recruiterScreens/offers/${offerId}`)
// }

// const handleViewCrew = (offerId: string) => {
//   // Navigate to crew list
//   router.push({
//     pathname: '/recruiterScreens/crew/list',
//     params: { offerId },
//   })
// }
