import React from 'react'
import { ScrollView } from 'react-native'
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
  User,
  Edit,
  Euro,
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
  const search = isSuccess ? (data as any)?.[0] : null

  // const handleViewCandidates = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/list`)
  // }

  // const handleFindBySkills = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/search-skills`)
  // }

  // const handleFindByLocation = () => {
  //   router.push(`/recruiterScreens/offers/${searchId}/crew/search-location`)
  // }

  return (
    <>
      {search ? (
        <>
          <ScrollView className="flex-1">
            <VStack className="gap-4 p-2">
              {/* HEADER CARD */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  {/* Top Row: ID, Date, Edit */}
                  <HStack className="justify-between items-start gap-3">
                    <VStack className="gap-1 flex-1">
                      <HStack className="items-center gap-2">
                        <Text className="text-success-600 font-semibold text-sm">{t('offer.search-id')}:</Text>
                        <Text className="text-success-700 font-bold text-base">
                          {search.reference.substring(search.reference.indexOf('_') + 1)}
                        </Text>
                      </HStack>
                      <Text className="text-typography-500 text-xs">{search.offerdate}</Text>
                    </VStack>
                    <Button variant="solid" action="positive" onPress={console.log} className="rounded-lg">
                      <ButtonIcon as={Edit} />
                      <ButtonText>{t('offer.edit-offer-short')}</ButtonText>
                    </Button>
                  </HStack>

                  <Divider />
                  {/* Offer Title */}
                  <Heading size="2xl" className="text-typography-700 leading-tight">
                    {search.offer.trim()}
                  </Heading>
                  {/* Admin Warning */}
                  {/* {search.offerPublished === 0 && (
                    <Box className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                      <HStack className="items-center gap-2">
                        <Icon as={AlertCircle} className="text-warning-600" size="sm" />
                        <Text className="text-warning-900 font-semibold text-sm flex-1">
                          Offer modified by the Administrator
                        </Text>
                      </HStack>
                    </Box>
                  )} */}
                </VStack>
              </Box>

              {/* CONTRACT & COMPENSATION */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <HStack className="items-center gap-2 mb-4">
                  <Icon as={FileText} className="text-primary-600" size="md" />
                  <Heading size="lg" className="text-primary-600">
                    {t('recruiter.search.search-details.contract-and-compensation')}
                  </Heading>
                </HStack>
                <VStack className="gap-3">
                  {/* Salary & Duration Grid */}
                  <VStack className="gap-3">
                    <Box className="bg-success-50 border border-success-200 rounded-lg p-4 flex-1">
                      <VStack className="gap-2">
                        <HStack className="items-center gap-2">
                          <Icon as={Euro} className="text-success-600" size="sm" />
                          <Text className="text-success-700 text-xs font-medium uppercase tracking-wide">
                            {t('offerSalary')}
                          </Text>
                        </HStack>
                        <HStack>
                          <Text className="text-success-900 font-bold text-lg">{search.salary_From}</Text>
                          <Text className="text-success-900 font-bold text-lg">{' -'}</Text>

                          <Text className="text-success-900 font-bold text-lg">{search.salary_To}</Text>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex-1">
                      <VStack className="gap-2">
                        <HStack className="items-center gap-2">
                          <Icon as={Calendar} className="text-primary-600" size="sm" />
                          <Text className="text-primary-700 text-xs font-medium uppercase tracking-wide">Duration</Text>
                        </HStack>
                        <HStack className="items-center gap-2">
                          <HStack>
                            <Text className="text-primary-900 font-semibold text-sm">From:</Text>
                            <Text className="text-primary-900 font-bold text-sm">{search.boarding}</Text>
                          </HStack>
                          <HStack>
                            <Text className="text-primary-900 font-semibold text-sm ">To:</Text>
                            <Text className="text-primary-900 font-bold text-sm">{search.duration}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>

                  <Divider />

                  {/* Contract Details */}
                  <VStack className="gap-2">
                    <HStack className="items-start gap-2">
                      <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Contract Type:</Text>
                      <Text className="text-typography-900 text-sm font-semibold flex-1">
                        {search.contractDescription}
                      </Text>
                    </HStack>

                    <HStack className="items-start gap-2">
                      <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Boarding:</Text>
                      <Text className="text-typography-900 text-sm font-semibold flex-1">{search.boarding}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {/* POSITION DETAILS */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <HStack className="items-center gap-2 mb-4">
                  <Icon as={Briefcase} className="text-primary-600" size="md" />
                  <Heading size="lg" className="text-primary-600">
                    Position Details
                  </Heading>
                </HStack>

                <VStack className="gap-4">
                  {/* Main Position */}
                  <Box className="bg-primary-500 rounded-lg px-4 py-3">
                    <VStack className="gap-1">
                      <Text className="text-white/80 text-xs font-medium uppercase tracking-wide">Main Position</Text>
                      <Heading size="xl" className="text-white">
                        {search.mainPosition}
                      </Heading>
                    </VStack>
                  </Box>

                  {/* Requirements */}
                  {search.requirements && (
                    <VStack className="gap-2">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Requirements
                      </Text>
                      <Box className="bg-background-50 border border-outline-200 rounded-lg p-3">
                        <Text className="text-typography-900 text-sm leading-relaxed">{search.requirements}</Text>
                      </Box>
                    </VStack>
                  )}

                  {/* Description */}
                  {search.descriptionOffer && (
                    <VStack className="gap-2">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Description
                      </Text>
                      <Box className="bg-background-50 border border-outline-200 rounded-lg p-3">
                        <Text className="text-typography-900 text-sm leading-relaxed">
                          {search.descriptionOffer.replace(/<\/?b>/g, '')}
                        </Text>
                      </Box>
                    </VStack>
                  )}

                  {/* Additional Details as Badges */}
                  <VStack className="gap-3 mt-2">
                    <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                      Additional Information
                    </Text>

                    <HStack className="flex-wrap gap-2">
                      {/* Owner Type */}
                      <Box className="bg-info-50 border border-info-200 rounded-lg px-3 py-2">
                        <HStack className="items-center gap-2">
                          <Icon as={Ship} className="text-info-600" size="xs" />
                          <VStack className="gap-0.5">
                            <Text className="text-info-600 text-xs font-medium">Owner</Text>
                            <Text className="text-info-900 text-sm font-semibold">{search.ownerDescription}</Text>
                          </VStack>
                        </HStack>
                      </Box>

                      {/* Gender */}
                      {search.gender && (
                        <Box className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                          <HStack className="items-center gap-2">
                            <Icon as={User} className="text-purple-600" size="xs" />
                            <VStack className="gap-0.5">
                              <Text className="text-purple-600 text-xs font-medium">Gender</Text>
                              <Text className="text-purple-900 text-sm font-semibold">{search.gender}</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      )}

                      {/* Seaman's Book */}
                      {search.seamensBook && (
                        <Box className="bg-success-50 border border-success-200 rounded-lg px-3 py-2">
                          <HStack className="items-center gap-2">
                            <Icon as={Award} className="text-success-600" size="xs" />
                            <Text className="text-success-900 text-sm font-semibold">{search.seamensBook}</Text>
                          </HStack>
                        </Box>
                      )}

                      {/* Courses */}
                      {search.courses && (
                        <Box className="bg-warning-50 border border-warning-200 rounded-lg px-3 py-2">
                          <HStack className="items-center gap-2">
                            <Icon as={Award} className="text-warning-600" size="xs" />
                            <Text className="text-warning-900 text-sm font-semibold">{search.courses}</Text>
                          </HStack>
                        </Box>
                      )}

                      {/* Special Position */}
                      {search.positionSpecial && (
                        <Box className="bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2">
                          <Text className="text-secondary-900 text-sm font-semibold">{search.positionSpecial}</Text>
                        </Box>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {/* CANDIDATES SECTION */}
              <Box className="bg-white rounded-lg shadow-sm">
                <Pressable
                  onPress={
                    () => console.log('clicked')
                    // handleViewCandidates
                  }
                >
                  <Box className="p-4">
                    <HStack className="items-center gap-3">
                      <Box className="bg-success-100 rounded-lg p-3">
                        <Icon as={Users} className="text-success-600" size="xl" />
                      </Box>
                      <VStack className="flex-1 gap-1">
                        <Heading size="lg" className="text-typography-900">
                          {search.countCandidates} Candidates
                        </Heading>
                        <HStack className="gap-2 flex-wrap">
                          <Box className="bg-success-100 rounded-full px-3 py-1">
                            <Text className="text-success-700 text-xs font-semibold">
                              Contacted: {search.countContacted}
                            </Text>
                          </Box>
                          <Box className="bg-warning-100 rounded-full px-3 py-1">
                            <Text className="text-warning-700 text-xs font-semibold">
                              Residual: {search.countResidual}
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                      <Icon as={Info} className="text-typography-400" size="md" />
                    </HStack>
                  </Box>
                </Pressable>
              </Box>

              {/* Expiration Notice */}
              <Box className="bg-background-100 rounded-lg p-4 border border-outline-200">
                <HStack className="items-center gap-2">
                  <Icon as={Calendar} className="text-typography-500" size="sm" />
                  <Text className="text-typography-600 text-xs">
                    Offer expires:{' '}
                    <Text className="font-semibold text-typography-900">{search.offertExpirationdate}</Text>
                  </Text>
                </HStack>
              </Box>
              <Box className="bg-white border-t border-outline-100 p-4 shadow-2xl rounded-xl">
                <VStack className="gap-3">
                  <Button
                    size="lg"
                    variant="solid"
                    action="positive"
                    // onPress={handleFindBySkills}
                    className="rounded-lg"
                  >
                    <ButtonIcon as={UserSearch} />
                    <ButtonText className="ml-2">Find your Crew by Skills</ButtonText>
                  </Button>

                  <Button
                    size="lg"
                    variant="solid"
                    action="positive"
                    // onPress={handleFindByLocation}
                    className="rounded-lg"
                  >
                    <ButtonIcon as={MapIcon} />
                    <ButtonText className="ml-2">Find your Crew by Location</ButtonText>
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </ScrollView>

          {/* FIXED BOTTOM ACTIONS */}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  )
}
