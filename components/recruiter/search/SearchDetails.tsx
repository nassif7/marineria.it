import React from 'react'
import { ScrollView, SafeAreaView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  Icon,
  Divider,
  Pressable,
  Badge,
  BadgeText,
  Loading,
} from '@/components/ui'
import {
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Ship,
  FileText,
  Clock,
  Award,
  Briefcase,
  UserSearch,
  Map as MapIcon,
  Info,
  AlertCircle,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ActiveProfile, useUser } from '@/Providers/UserProvider'
import { useQuery } from '@tanstack/react-query'
import { getRecruiterSearchById } from '@/api'

//#TODO: Still need to check it with the team
export default function SearchDetails() {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { searchId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { role, token } = activeProfile as ActiveProfile

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['recruiter-search-by-id', searchId],
    queryFn: () => getRecruiterSearchById(searchId as string, token, language),
  })
  const router = useRouter()

  // Fetch offer details
  const offer = isSuccess ? (data as any)?.[0] : null

  // const handleViewCandidates = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/list`)
  // }

  // const handleFindBySkills = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/search-skills`)
  // }

  // const handleFindByLocation = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/search-location`)
  // }

  console.log('data', offer)

  return (
    <>
      {offer ? (
        <>
          <ScrollView className="flex-1 ">
            <VStack className="gap-3 p-2  bg-background-100 rounded-lg">
              {/* Header Card with Title */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  {/* Search ID & Date */}
                  <HStack className="justify-between items-start">
                    <VStack className="gap-1 flex-1">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">Search ID</Text>
                      <Text className="text-success-600 font-bold text-lg">
                        {offer.reference.substring(offer.reference.indexOf('_') + 1)}
                      </Text>
                    </VStack>
                    <VStack className="items-end gap-1">
                      <Text className="text-typography-500 text-xs">{offer.offerdate}</Text>
                      <Pressable>
                        <Badge className="bg-success-600 rounded-lg">
                          <BadgeText className="text-white text-xs font-semibold px-2">Mod.</BadgeText>
                        </Badge>
                      </Pressable>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Offer Title */}
                  <Heading size="xl" className="text-primary-600 leading-tight">
                    {offer.offer.trim()}
                  </Heading>
                </VStack>
              </Box>

              {/* Admin Notification (if modified) */}
              {offer.offerPublished === 0 && (
                <Box className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                  <HStack className="items-start gap-3">
                    <Icon as={AlertCircle} className="text-warning-600 shrink-0" size="md" />
                    <VStack className="flex-1">
                      <Text className="text-warning-900 font-semibold text-sm">
                        Offer modified by the Administrator
                      </Text>
                    </VStack>
                    <Icon as={Info} className="text-warning-600" size="sm" />
                  </HStack>
                </Box>
              )}

              {/* Candidates Stats */}
              <Box className="bg-white rounded-xl p-4 shadow-sm">
                <Pressable onPress={console.log}>
                  <HStack className="items-center gap-3">
                    <Box className="bg-success-100 rounded-lg p-3">
                      <Icon as={Users} className="text-success-600" size="lg" />
                    </Box>
                    <VStack className="flex-1 gap-1">
                      <Text className="text-typography-900 font-bold text-lg">{offer.countCandidates} Candidates</Text>
                      <HStack className="gap-2 flex-wrap">
                        <Box className="bg-success-100 rounded-full px-3 py-1">
                          <Text className="text-success-700 text-xs font-semibold">
                            Contacted: {offer.countContacted}
                          </Text>
                        </Box>
                        <Box className="bg-warning-100 rounded-full px-3 py-1">
                          <Text className="text-warning-700 text-xs font-semibold">
                            Residual: {offer.countResidual}
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                    <Icon as={Info} className="text-typography-400" size="md" />
                  </HStack>
                </Pressable>
              </Box>

              {/* Position Details */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  <HStack className="items-center gap-2 mb-2">
                    <Icon as={Briefcase} className="text-primary-600" size="md" />
                    <Heading size="md" className="text-primary-600">
                      Position Details
                    </Heading>
                  </HStack>

                  {/* Main Position */}
                  <VStack className="gap-1">
                    <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                      Main Position
                    </Text>
                    <Text className="text-typography-900 font-bold text-lg">{offer.mainPosition}</Text>
                  </VStack>

                  {/* Requirements */}
                  {offer.requirements && (
                    <VStack className="gap-1">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Requirements
                      </Text>
                      <Box className="bg-background-50 rounded-lg p-3">
                        <Text className="text-typography-900 text-sm leading-relaxed">{offer.requirements}</Text>
                      </Box>
                    </VStack>
                  )}

                  {/* Description */}
                  {offer.descriptionOffer && (
                    <VStack className="gap-1">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Description
                      </Text>
                      <Box className="bg-background-50 rounded-lg p-3">
                        <Text className="text-typography-900 text-sm leading-relaxed">{offer.descriptionOffer}</Text>
                      </Box>
                    </VStack>
                  )}
                </VStack>
              </Box>

              {/* Contract & Compensation */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  <HStack className="items-center gap-2 mb-2">
                    <Icon as={FileText} className="text-primary-600" size="md" />
                    <Heading size="md" className="text-primary-600">
                      Contract & Compensation
                    </Heading>
                  </HStack>

                  <HStack className="gap-3">
                    {/* Salary */}
                    <Box className="bg-success-50 border border-success-200 rounded-xl p-4 flex-1">
                      <VStack className="gap-2">
                        <HStack className="items-center gap-2">
                          <Icon as={DollarSign} className="text-success-600" size="sm" />
                          <Text className="text-success-700 text-xs font-medium uppercase tracking-wide">
                            Salary Range
                          </Text>
                        </HStack>
                        <Text className="text-success-900 font-bold text-base">
                          {offer.salary_From} - {offer.salary_To}
                        </Text>
                      </VStack>
                    </Box>

                    {/* Duration */}
                    <Box className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex-1">
                      <VStack className="gap-2">
                        <HStack className="items-center gap-2">
                          <Icon as={Clock} className="text-primary-600" size="sm" />
                          <Text className="text-primary-700 text-xs font-medium uppercase tracking-wide">Duration</Text>
                        </HStack>
                        <Text className="text-primary-900 font-bold text-sm break-words">{offer.duration}</Text>
                      </VStack>
                    </Box>
                  </HStack>

                  {/* Contract Type */}
                  <VStack className="gap-1">
                    <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                      Contract Type
                    </Text>
                    <Text className="text-typography-900 font-semibold text-base">{offer.contractDescription}</Text>
                  </VStack>

                  {/* Boarding */}
                  <VStack className="gap-1">
                    <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">Boarding</Text>
                    <Text className="text-typography-900 font-semibold text-base">{offer.boarding}</Text>
                  </VStack>
                  {offer.gender && (
                    <VStack className="gap-1">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Gender Preference:
                      </Text>
                      <Text className="text-typography-900 font-semibold text-base">{offer.gender}</Text>
                    </VStack>
                  )}
                </VStack>
              </Box>

              {/* Vessel Information */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  <HStack className="items-center gap-2 mb-2">
                    <Icon as={Ship} className="text-primary-600" size="md" />
                    <Heading size="md" className="text-primary-600">
                      Boat Information
                    </Heading>
                  </HStack>

                  <HStack className="gap-2 items-start">
                    <Text className="text-typography-500 text-sm font-medium shrink-0 w-32">Owner Type:</Text>
                    <Text className="text-typography-900 text-sm flex-1 break-words">{offer.ownerDescription}</Text>
                  </HStack>
                </VStack>
              </Box>
              {/* Required Qualifications */}
              {offer.courses && (
                <Box className="bg-white rounded-2xl p-5 shadow-sm">
                  <VStack className="gap-3">
                    <HStack className="items-center gap-2 mb-2">
                      <Icon as={Award} className="text-primary-600" size="md" />
                      <Heading size="md" className="text-primary-600">
                        Required Qualifications
                      </Heading>
                    </HStack>

                    <Box className="bg-primary-50 rounded-lg p-3">
                      <Text className="text-primary-900 font-semibold text-sm">{offer.courses}</Text>
                    </Box>
                  </VStack>
                </Box>
              )}

              {/* Expiration */}
              <Box className="bg-background-100 rounded-xl p-4 border border-outline-200">
                <HStack className="items-center gap-2">
                  <Icon as={Calendar} className="text-typography-500" size="sm" />
                  <Text className="text-typography-600 text-xs">
                    Offer expires: <Text className="font-semibold">{offer.offertExpirationdate}</Text>
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ScrollView>

          {/* Fixed Bottom Actions */}
          {/* <Box className="border-t border-outline-100 p-4 shadow-lg bg-secondary-800">
            <VStack className="gap-3">
              <Button size="lg" variant="solid" action="positive" onPress={console.log} className="rounded-xl">
                <ButtonIcon as={Users} />
                <ButtonText className="ml-2">View {offer.countCandidates} Candidates</ButtonText>
              </Button>

              <HStack className="gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  action="positive"
                  onPress={console.log}
                  className="rounded-xl flex-1"
                >
                  <ButtonIcon as={UserSearch} size="sm" />
                  <ButtonText className="ml-2">By Skills</ButtonText>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  action="positive"
                  onPress={console.log}
                  className="rounded-xl flex-1"
                >
                  <ButtonIcon as={MapIcon} size="sm" />
                  <ButtonText className="ml-2">By Location</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box> */}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  )
}
