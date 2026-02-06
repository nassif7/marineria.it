// import React, { useMemo } from 'react'
// import { CrewType } from '@/api/types'
// import {
//   Avatar,
//   AvatarFallbackText,
//   AvatarImage,
//   Box,
//   Button,
//   ButtonText,
//   Card,
//   Divider,
//   Heading,
//   Image,
//   Text,
//   VStack,
//   Link,
//   LinkText,
//   HStack,
//   ButtonIcon,
//   Pressable,
// } from '@/components/ui'
// import { CircleCheck, CircleX, EyeIcon, Edit, Users, UserSearch, Locate, Map } from 'lucide-react-native'
// import { faker } from '@faker-js/faker'
// import { formatDate, getAge } from '@/utils/dateUtils'
// import { BASE_URL } from '@/api/const'
// import { useTranslation } from 'react-i18next'
// import { router } from 'expo-router'

// const CrewListItem: React.FC<{ crew: CrewType; offerId: any }> = ({ crew, offerId }) => {
//   const photoUrl = useMemo(() => `https://www.comunicazione.it/PROFoto/${crew?.userPhoto}`, [crew])
//   const fakerImage = useMemo(() => faker.image.personPortrait({ size: 256 }), [crew])

//   const {
//     i18n: { language },
//   } = useTranslation()

//   const crewDetailsInfo = useMemo(
//     () => ({
//       martialStatus: crew.maritalStatus ? 'Married' : 'Single',
//       smoker: !!crew.smoker ? 'Non Smoker' : 'Smoker',
//       city: crew.city,
//       citizenship: crew.passport,
//     }),
//     [crew]
//   )

//   return (
//     <Card className="p-4 rounded-lg my-2">
//       <Box className="flex-row  items-center">
//         <Avatar className="mr-4">
//           <AvatarFallbackText>{`${crew.firstName} ${crew.lastName} `}</AvatarFallbackText>
//           <AvatarImage
//             source={{
//               uri: fakerImage,
//             }}
//           />
//         </Avatar>
//         <Heading size="lg" className="text-primary-600">
//           Profile {crew.userId}
//         </Heading>
//       </Box>
//       <Box className="mt-4 flex-col border-2 border-outline-200 rounded">
//         <VStack className="w-full border-b-2 border-outline-200 p-2 bg-outline-50 ">
//           <Heading size="md">
//             {/* {crew.position} */}
//             Master (CoC)
//           </Heading>
//         </VStack>
//         <VStack className="w-full border-b-2 border-outline-200 p-2">
//           <Heading size="md" className="text-success-400">
//             Available fom: 11/04/2025
//             {/* {crew.availability || AvailableFrom} */}
//           </Heading>
//         </VStack>
//         <VStack className="w-full p-2">
//           <Text>
//             {crewDetailsInfo.martialStatus}, {crewDetailsInfo.smoker}, {getAge(crew.birthYear)} years old
//           </Text>
//           <Text>From: {crewDetailsInfo.city}</Text>
//           <Text>Citizenship: {crewDetailsInfo.citizenship}</Text>
//         </VStack>
//       </Box>
//       <Box className="my-4 flex-col border-2 border-outline-200 rounded">
//         <VStack className="w-full border-b-2 border-outline-200 p-2 bg-outline-50 ">
//           <Heading size="md">{crew.lastAccessDate}</Heading>
//         </VStack>
//         <VStack className="w-full p-2">
//           {/* missing information */}
//           <Text size="md" className="text-success-400">
//             IMO Basic Training
//           </Text>
//           <Text size="md" className="text-success-400">
//             Yes Seaman's Book
//           </Text>
//           <Text size="md" className="">
//             Experience: not declared
//           </Text>
//           <Text size="md" className="">
//             35 years on Seaman's Book
//           </Text>
//           <Text size="md" className="">
//             Also skilled as: Bosun Deck Officer Captain
//           </Text>
//         </VStack>
//       </Box>

//       <Button
//         className="py-2 px-4"
//         variant="outline"
//         action="positive"
//         onPress={() =>
//           // router.push({
//           //   pathname: `/(tabs)/recruiterScreens/crew/crewProfile`,
//           //   params: { crewId: crew.userId, offerId: offerId },
//           // })
//           router.push(`/recruiter/search/${offerId}/crew/${crew.userId}}`)
//         }
//       >
//         <ButtonIcon as={EyeIcon} className="text-success-400 mr-2" />
//         <ButtonText className="text-success-400">Visit Resume</ButtonText>
//       </Button>
//     </Card>
//   )
// }

// export default CrewListItem

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

import React, { useMemo } from 'react'
import { CrewType } from '@/api/types'
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Card,
  Divider,
  Heading,
  Image,
  Text,
  VStack,
  Link,
  LinkText,
  HStack,
  ButtonIcon,
  Pressable,
  Icon,
  Badge,
  BadgeText,
} from '@/components/ui'
import {
  CircleCheck,
  CircleX,
  EyeIcon,
  Edit,
  Users,
  UserSearch,
  Locate,
  Map,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Star,
  Briefcase,
  Anchor,
  MapPin,
} from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { formatDate, getAge } from '@/utils/dateUtils'
import { BASE_URL } from '@/api/const'
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
    // <Pressable key={crew.userId} onPress={console.log}>
    //   <Box className="bg-white rounded-xl p-4 shadow-sm border border-outline-100">
    //     <HStack className="gap-3 mb-3">
    //       {/* Avatar */}
    //       <Box className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center shrink-0">
    //         <Text className="text-primary-600 font-bold text-lg">
    //           {crew.firstName[0]}
    //           {crew.lastName[0]}
    //         </Text>
    //       </Box>

    //       {/* Info */}
    //       <VStack className="flex-1 gap-1 justify-center min-w-0">
    //         <Heading size="md" className="text-typography-900 break-words">
    //           {crew.firstName} {crew.lastName}
    //         </Heading>
    //         <Text className="text-primary-600 font-semibold text-sm">{crew.mainPosition}</Text>
    //         <Text className="text-typography-500 text-xs">
    //           {crew.city}, {crew.country} • {crew.calculatedExperience}
    //         </Text>
    //       </VStack>

    //       {/* Status Badge */}
    //       {crew.selected && (
    //         <Box className="bg-success-100 rounded-full w-8 h-8 items-center justify-center shrink-0">
    //           <Icon as={CheckCircle} className="text-success-600" size="sm" />
    //         </Box>
    //       )}
    //     </HStack>

    //     {/* Quick Tags */}
    //     <HStack className="flex-wrap gap-2">
    //       <Box className="bg-background-50 rounded-full px-2 py-1">
    //         <Text className="text-typography-700 text-xs">Available: {crew.dateAvailability}</Text>
    //       </Box>
    //       {crew.photoApproved && (
    //         <Box className="bg-success-100 rounded-full px-2 py-1">
    //           <Text className="text-success-700 text-xs font-semibold">✓ Verified</Text>
    //         </Box>
    //       )}
    //     </HStack>
    //   </Box>
    // </Pressable>

    // <Pressable
    //   key={crew.userId}
    //   onPress={() => router.push(`/recruiter/search/${searchId}/crew/${crew.userId}`)}
    //   className="mb-2"
    // >
    //   <Box className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-100">
    //     {/* Status Banner (if selected or rejected) */}
    //     {crew.selected && (
    //       <Box className="bg-success-500 px-4 py-2">
    //         <HStack className="items-center gap-2">
    //           <Icon as={CheckCircle} className="text-white" size="sm" />
    //           <Text className="text-white font-semibold text-xs">Selected Candidate</Text>
    //         </HStack>
    //       </Box>
    //     )}
    //     {crew.rejected && (
    //       <Box className="bg-error-500 px-4 py-2">
    //         <HStack className="items-center gap-2">
    //           <Icon as={XCircle} className="text-white" size="sm" />
    //           <Text className="text-white font-semibold text-xs">Rejected</Text>
    //         </HStack>
    //       </Box>
    //     )}

    //     <Box className="p-4">
    //       <VStack className="gap-3">
    //         {/* Header with Photo and Name */}
    //         <HStack className="gap-3">
    //           {/* Profile Photo */}
    //           <Box className="w-16 h-16 rounded-full overflow-hidden bg-background-100 items-center justify-center">
    //             {crew.userPhoto ? (
    //               <Image source={{ uri: fakerImage }} className="w-full h-full" alt="profile" />
    //             ) : (
    //               <Icon as={User} className="text-typography-400" size="xl" />
    //             )}
    //           </Box>

    //           {/* Name and ID */}
    //           <VStack className="flex-1 gap-1 justify-center">
    //             <Heading size="lg" className="text-typography-900">
    //               {crew.firstName} {crew.lastName}
    //             </Heading>
    //             <Text className="text-primary-600 font-semibold text-sm">ID: {crew.userId}</Text>
    //           </VStack>

    //           {/* Stars Rating (if applicable) */}
    //           {crew.stars > 0 && (
    //             <Box className="bg-warning-100 rounded-full px-3 py-1 h-fit">
    //               <HStack className="items-center gap-1">
    //                 <Icon as={Star} className="text-warning-600" size="xs" />
    //                 <Text className="text-warning-700 font-bold text-xs">{crew.stars}</Text>
    //               </HStack>
    //             </Box>
    //           )}
    //         </HStack>

    //         {/* Main Position */}
    //         <Box className=" border border-secondary-200 rounded-lg px-3 py-2">
    //           <HStack className="items-center gap-2">
    //             <Icon as={Briefcase} className="text-primary-600" size="sm" />
    //             <Text className="font-bold text-base flex-1">{crew.mainPosition}</Text>
    //           </HStack>
    //         </Box>

    //         {/* Quick Info Grid */}
    //         <VStack className="gap-2">
    //           {/* Location */}
    //           <HStack className="items-start gap-2">
    //             <Icon as={MapPin} className="text-typography-500 shrink-0 mt-0.5" size="sm" />
    //             <VStack className="flex-1 gap-0.5">
    //               <Text className="text-typography-500 text-xs">Location</Text>
    //               <Text className="text-typography-900 text-sm font-medium">
    //                 {crew.city}, {crew.country}
    //               </Text>
    //             </VStack>
    //           </HStack>

    //           {/* Experience */}
    //           <HStack className="items-start gap-2">
    //             <Icon as={Anchor} className="text-typography-500 shrink-0 mt-0.5" size="sm" />
    //             <VStack className="flex-1 gap-0.5">
    //               <Text className="text-typography-500 text-xs">Experience</Text>
    //               <Text className="text-typography-900 text-sm font-medium">{crew.calculatedExperience}</Text>
    //             </VStack>
    //           </HStack>

    //           {/* Availability */}
    //           <HStack className="items-start gap-2">
    //             <Icon as={Calendar} className="text-typography-500 shrink-0 mt-0.5" size="sm" />
    //             <VStack className="flex-1 gap-0.5">
    //               <Text className="text-typography-500 text-xs">Available</Text>
    //               <Text className="text-typography-900 text-sm font-medium">{crew.dateAvailability}</Text>
    //             </VStack>
    //           </HStack>
    //         </VStack>

    //         {/* Additional Positions Tags */}
    //         {/* {(crew.pos_deck || crew.pos_engine || crew.pos_harbour || crew.pos_hotel || crew.pos_special) && (
    //           <HStack className="flex-wrap gap-2 mt-1">
    //             {crew.pos_deck && (
    //               <Box className="bg-background-50 border border-outline-200 rounded-full px-2 py-1">
    //                 <Text className="text-typography-700 text-xs font-medium">{crew.pos_deck}</Text>
    //               </Box>
    //             )}
    //             {crew.pos_engine && (
    //               <Box className="bg-background-50 border border-outline-200 rounded-full px-2 py-1">
    //                 <Text className="text-typography-700 text-xs font-medium">{crew.pos_engine}</Text>
    //               </Box>
    //             )}
    //             {crew.pos_hotel && (
    //               <Box className="bg-background-50 border border-outline-200 rounded-full px-2 py-1">
    //                 <Text className="text-typography-700 text-xs font-medium">{crew.pos_hotel}</Text>
    //               </Box>
    //             )}
    //           </HStack>
    //         )} */}

    //         {/* Qualifications Badges */}
    //         <HStack className="flex-wrap gap-2">
    //           {crew.seamansBook && (
    //             <Box className="bg-background-50 border border-outline-200  rounded-lg px-2 py-1">
    //               <Text className="text-typography-700 text-xs font-semibold">{crew.seamansBook}</Text>
    //             </Box>
    //           )}
    //           {crew.licenseCode && (
    //             <Box className="bg-background-50 border border-outline-200  rounded-lg px-2 py-1">
    //               <Text className="text-typography-700 text-xs font-semibold">{crew.licenseCode}</Text>
    //             </Box>
    //           )}
    //           {crew.photoApproved && (
    //             <Box className="bg-background-50 border border-outline-200  rounded-lg px-2 py-1">
    //               <HStack className="items-center gap-1">
    //                 <Text className="text-typography-700 text-xs font-semibold">Verified</Text>
    //               </HStack>
    //             </Box>
    //           )}
    //         </HStack>

    //         {/* Footer - Last Seen */}
    //         {/* <Box className="pt-2 border-t border-outline-100">
    //           <Text className="text-typography-500 text-xs">Last seen: {crew.lastAccessDate}</Text>
    //         </Box> */}
    //       </VStack>
    //     </Box>
    //   </Box>
    // </Pressable>

    // <Pressable key={crew.userId} onPress={console.log}>
    //   <Box className="bg-white rounded-2xl p-4 shadow-sm border border-outline-200">
    //     {/* Header */}
    //     <HStack className="gap-3 items-start mb-3">
    //       <Box className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center">
    //         <Text className="text-primary-600 font-bold text-lg">
    //           {crew.firstName[0]}
    //           {crew.lastName[0]}
    //         </Text>
    //       </Box>

    //       <VStack className="flex-1 gap-1 min-w-0">
    //         <Heading size="md" className="text-typography-900 break-words">
    //           {crew.firstName} {crew.lastName}
    //         </Heading>
    //         <Text className="text-primary-600 font-semibold text-sm">{crew.mainPosition}</Text>
    //         <HStack className="gap-2 flex-wrap">
    //           {crew.selected && (
    //             <Badge className="bg-success-100 rounded-full px-2 py-0.5">
    //               <BadgeText className="text-success-700 text-xs font-bold">✓ Selected</BadgeText>
    //             </Badge>
    //           )}
    //           {crew.photoApproved && (
    //             <Badge className="bg-primary-100 rounded-full px-2 py-0.5">
    //               <BadgeText className="text-primary-700 text-xs font-bold">Verified</BadgeText>
    //             </Badge>
    //           )}
    //         </HStack>
    //       </VStack>
    //     </HStack>

    //     {/* Info Pills */}
    //     <HStack className="gap-2 flex-wrap mb-3">
    //       <Box className="bg-background-50 rounded-lg px-3 py-2">
    //         <HStack className="items-center gap-1.5">
    //           <Icon as={MapPin} className="text-typography-500" size="xs" />
    //           <Text className="text-typography-900 text-xs font-medium">
    //             {crew.city}, {crew.country}
    //           </Text>
    //         </HStack>
    //       </Box>

    //       <Box className="bg-background-50 rounded-lg px-3 py-2">
    //         <HStack className="items-center gap-1.5">
    //           <Icon as={Anchor} className="text-typography-500" size="xs" />
    //           <Text className="text-typography-900 text-xs font-medium">{crew.calculatedExperience}</Text>
    //         </HStack>
    //       </Box>

    //       <Box className="bg-background-50 rounded-lg px-3 py-2">
    //         <HStack className="items-center gap-1.5">
    //           <Icon as={Calendar} className="text-typography-500" size="xs" />
    //           <Text className="text-typography-900 text-xs font-medium">{crew.dateAvailability}</Text>
    //         </HStack>
    //       </Box>
    //     </HStack>

    //     {/* Qualifications */}
    //     <HStack className="gap-2 flex-wrap">
    //       {crew.seamansBook && (
    //         <Box className="bg-success-50 border border-success-200 rounded-full px-2 py-1">
    //           <Text className="text-success-700 text-xs font-semibold">{crew.seamansBook}</Text>
    //         </Box>
    //       )}
    //       {crew.licenseCode && (
    //         <Box className="bg-info-50 border border-info-200 rounded-full px-2 py-1">
    //           <Text className="text-info-700 text-xs font-semibold">{crew.licenseCode}</Text>
    //         </Box>
    //       )}
    //     </HStack>
    //   </Box>
    // </Pressable>

    <Pressable key={crew.userId} onPress={console.log} className="mb-2">
      <Box className="bg-white rounded-2xl p-4 shadow-sm border border-outline-200">
        {/* Header with Photo and Name */}
        <HStack className="gap-3 items-start mb-3">
          <Box className="w-14 h-14 rounded-full bg-primary-100 items-center justify-center">
            <Avatar className="mr-4">
              <AvatarFallbackText>{`${crew.firstName} ${crew.lastName} `}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: fakerImage,
                }}
              />
            </Avatar>
          </Box>

          <VStack className="flex-1 gap-1 min-w-0">
            <Heading size="md" className="text-typography-900 break-words">
              {crew.firstName} {crew.lastName}
            </Heading>
            <Text className="text-typography-500 text-sm">ID: {crew.userId}</Text>
          </VStack>

          {/* Status Badges */}
          <VStack className="gap-1">
            {crew.selected && (
              <Box className="bg-success-100 rounded-full px-2 py-1">
                <HStack className="items-center gap-1">
                  <Icon as={CheckCircle} className="text-success-700" size="xs" />
                  <Text className="text-success-700 text-xs font-bold">Selected</Text>
                </HStack>
              </Box>
            )}
            {crew.photoApproved && (
              <Box className="bg-primary-100 rounded-full px-2 py-1">
                <Text className="text-primary-700 text-xs font-bold">Verified</Text>
              </Box>
            )}
          </VStack>
        </HStack>

        {/* MAIN POSITION - Emphasized */}
        <Box className="bg-primary-500 rounded-xl px-4 py-3 mb-3">
          <HStack className="items-center gap-2">
            <Icon as={Briefcase} className="text-white" size="md" />
            <Heading size="lg" className="text-white flex-1">
              {crew.mainPosition}
            </Heading>
          </HStack>
        </Box>

        {/* Info Pills */}
        <HStack className="gap-2 flex-wrap mb-3">
          <Box className="bg-background-50 rounded-lg px-3 py-2">
            <HStack className="items-center gap-1.5">
              <Icon as={MapPin} className="text-typography-500" size="xs" />
              <Text className="text-typography-900 text-xs font-medium">
                {crew.city}, {crew.country}
              </Text>
            </HStack>
          </Box>

          <Box className="bg-background-50 rounded-lg px-3 py-2">
            <HStack className="items-center gap-1.5">
              <Icon as={Anchor} className="text-typography-500" size="xs" />
              <Text className="text-typography-900 text-xs font-medium">{crew.calculatedExperience}</Text>
            </HStack>
          </Box>

          <Box className="bg-background-50 rounded-lg px-3 py-2">
            <HStack className="items-center gap-1.5">
              <Icon as={Calendar} className="text-typography-500" size="xs" />
              <Text className="text-typography-900 text-xs font-medium">{crew.dateAvailability}</Text>
            </HStack>
          </Box>
        </HStack>

        {/* Qualifications */}
        <HStack className="gap-2 flex-wrap">
          {crew.seamansBook && (
            <Box className="bg-success-50 border border-success-200 rounded-full px-2 py-1">
              <Text className="text-success-700 text-xs font-semibold">{crew.seamansBook}</Text>
            </Box>
          )}
          {crew.licenseCode && (
            <Box className="bg-info-50 border border-info-200 rounded-full px-2 py-1">
              <Text className="text-info-700 text-xs font-semibold">{crew.licenseCode}</Text>
            </Box>
          )}
        </HStack>
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
