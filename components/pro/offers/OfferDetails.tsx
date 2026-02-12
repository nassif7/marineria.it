import React from 'react'
import { ScrollView, Share, Alert } from 'react-native'
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
  View,
  Loading,
} from '@/components/ui'
import {
  Euro,
  Calendar,
  DollarSign,
  MapPin,
  Ship,
  FileText,
  Clock,
  Award,
  Briefcase,
  Send,
  CheckCircle,
  Share2,
  AlertCircle,
  User,
} from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFetch } from '@/hooks'
import { useCallback, useState } from 'react'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useTranslation } from 'react-i18next'
import { getProOfferById, applyToOffer } from '@/api'
import { AuthTypes } from '@/api/types'
import { useQuery } from '@tanstack/react-query'

export default function OfferDetailsScreen() {
  const [applying, setApplying] = useState(false)
  const [loading, setLoading] = useState(false)
  const { offerId } = useLocalSearchParams()
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const { isFetching, data, isSuccess } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => getProOfferById(offerId as string, token, language),
  })

  // const fetchOffer = useCallback(
  //   async () =>
  //     await (role == AuthTypes.UserRole.OWNER
  //       ? getOwnerOfferById(offerId as string, token, language)
  //       : getProOfferById(offerId as string, token, language)),
  //   [token, language, offerId]
  // )

  const offer = isSuccess ? (data as any)?.[0] : null

  // Fetch offer details

  // const handleApply = async () => {
  //   setApplying(true)
  //   try {
  //     // API call to apply for the job
  //     await applyForJob(offer.idoffer)
  //     Alert.alert('Success', 'Your application has been sent!')
  //     router.back()
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to apply. Please try again.')
  //   } finally {
  //     setApplying(false)
  //   }
  // }

  // const handleShare = async () => {
  //   try {
  //     await Share.share({
  //       message: `Check out this job offer: ${offer.offer}\n\nSalary: ${offer.salary_From} - ${offer.salary_To}\nRef: ${offer.reference}`,
  //       title: offer.offer,
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const onShare = async () => {
    const title = offer?.offer.trimStart()

    try {
      const result = await Share.share(
        {
          title,
          message: 'Here is a jobOffer for you on marineria!',
          url: `https://www.marineria.it/${language}/Apply.aspx?IdOfferta=${offer?.idoffer}`,
        },
        {
          dialogTitle: 'Job offer at marineria!',
          subject: 'Job offer at marineria!',
        }
      )
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     console.log('1', result.activityType, result)
      //     // shared with activity type of result.activityType
      //   } else {
      //     console.log('2', result)
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   console.log('dismissed', result)
      //   // dismissed
      // }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  const onApply = async () => {
    setLoading(true)
    const response = await applyToOffer(token, parseInt(offerId as string), language)
    if (response?.ok) {
      Alert.alert('You have successfully applied to this offer')
    } else {
      Alert.alert('Something went wrong, please try again later')
    }
    setLoading(false)
  }

  // Parse HTML description
  const cleanDescription = offer?.descriptionOffer?.replace(/<\/?b>/g, '') || ''

  return (
    <>
      {isFetching && <Loading />}
      {offer && (
        <View className="flex-1">
          <ScrollView className="flex-1">
            <VStack className="gap-2 p-2">
              {/* HEADER CARD */}
              <Box className="bg-background-50 rounded-2xl p-5 shadow-sm">
                <VStack className="gap-3">
                  {/* Reference & Date */}
                  <HStack className="justify-between items-start">
                    <VStack className="gap-1">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Job Reference
                      </Text>
                      <Text className="text-primary-600 font-bold text-lg">{offer.reference.split('_')[1]}</Text>
                    </VStack>

                    <VStack className="items-end gap-1">
                      <Text className="text-typography-500 text-xs">Posted</Text>
                      <Text className="text-typography-900 font-semibold text-sm">{offer.offerdate}</Text>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Job Title */}
                  <Heading size="2xl" className="text-primary-600 leading-tight">
                    {offer.offer.trim()}
                  </Heading>

                  {/* Status Banners */}
                  {offer.alreadyApplied && (
                    <Box className="bg-success-50 border border-success-200 rounded-lg p-3">
                      <HStack className="items-center gap-2">
                        <Icon as={CheckCircle} className="text-success-600" size="md" />
                        <Text className="text-success-900 font-semibold text-sm">
                          You have already applied to this offer
                        </Text>
                      </HStack>
                    </Box>
                  )}

                  {!offer.offerApplicable && !offer.alreadyApplied && (
                    <Box className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                      <HStack className="items-center gap-2">
                        <Icon as={AlertCircle} className="text-warning-600" size="md" />
                        <VStack className="flex-1">
                          <Text className="text-warning-900 font-semibold text-sm">Not applicable to your profile</Text>
                          <Text className="text-warning-700 text-xs mt-0.5">
                            You can still share this offer with others
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* CONTRACT & COMPENSATION */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <HStack className="items-center gap-2 mb-4">
                  <Icon as={FileText} className="text-primary-600" size="md" />
                  <Heading size="lg" className="text-primary-600">
                    {t('crew-screens.offer-details.contract-and-compensation')}
                  </Heading>
                </HStack>

                <VStack className="gap-3">
                  {/* Salary & Duration Grid */}
                  <VStack className="gap-3">
                    <Box className="bg-success-50 border border-success-200 rounded-lg px-3 py-2 flex-1">
                      <VStack className="gap-0.5">
                        <HStack className="items-center gap-1">
                          <Icon as={Euro} className="text-success-600" size="xs" />
                          <Text className="text-success-600 text-xs font-medium">Salary</Text>
                        </HStack>
                        <Text className="text-success-900 font-bold text-sm">
                          {offer.salary_From} - {offer.salary_To}
                        </Text>
                      </VStack>
                    </Box>

                    <Box className="bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 flex-1">
                      <VStack className="gap-0.5">
                        <HStack className="items-center gap-1">
                          <Icon as={Calendar} className="text-primary-600" size="xs" />
                          <Text className="text-primary-600 text-xs font-medium">Duration</Text>
                        </HStack>
                        <HStack>
                          <Text className="text-primary-900 font-bold text-sm">
                            From: {offer.offerdate.split(',')[1].trim() + ' '}
                          </Text>
                          <Text className="text-primary-900 font-bold text-sm">
                            To: {offer.duration || offer.offertExpirationdate}
                          </Text>
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
                        {offer.contractDescription}
                      </Text>
                    </HStack>

                    <HStack className="items-start gap-2">
                      <Text className="text-typography-500 text-sm font-medium w-32 shrink-0">Boarding:</Text>
                      <Text className="text-typography-900 text-sm font-semibold flex-1">{offer.boarding}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {/* POSITION & REQUIREMENTS */}
              <Box className="bg-white rounded-2xl p-5 shadow-sm">
                <HStack className="items-center gap-2 mb-4">
                  <Icon as={Briefcase} className="text-primary-600" size="md" />
                  <Heading size="lg" className="text-primary-600">
                    Position & Requirements
                  </Heading>
                </HStack>

                <VStack className="gap-4">
                  {/* Main Position - Emphasized */}
                  <Box className=" bg-white rounded-2xl  shadow-sm">
                    <VStack className="gap-2">
                      <HStack className="items-center gap-2">
                        <Icon as={Briefcase} className="text-typography-500 " size="sm" />
                        <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                          Main Position
                        </Text>
                      </HStack>
                      <Heading size="xl" className="text-primary-900">
                        {offer.mainPosition}
                      </Heading>
                    </VStack>
                  </Box>

                  {/* Requirements - Highlighted */}
                  {offer.requirements && (
                    <VStack className="gap-2">
                      <HStack className="items-center gap-2">
                        <Icon as={CheckCircle} className="text-success-600" size="sm" />
                        <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                          Requirements
                        </Text>
                      </HStack>
                      <Box className="bg-success-50 border-l-4 border-success-500 rounded-lg p-4">
                        <Text className="text-success-900 text-sm font-semibold leading-relaxed">
                          {offer.requirements}
                        </Text>
                      </Box>
                    </VStack>
                  )}

                  {/* Description */}
                  {cleanDescription && (
                    <VStack className="gap-2">
                      <Text className="text-typography-500 text-xs font-medium uppercase tracking-wide">
                        Job Description
                      </Text>
                      <Box className="bg-background-50 border border-outline-200 rounded-lg p-4">
                        <Text className="text-typography-900 text-sm leading-relaxed">{cleanDescription}</Text>
                      </Box>
                    </VStack>
                  )}

                  {/* Additional Positions & Details */}
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
                            <Text className="text-info-900 text-sm font-semibold">{offer.ownerDescription}</Text>
                          </VStack>
                        </HStack>
                      </Box>

                      {/* Gender */}
                      {offer.gender && (
                        <Box className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                          <HStack className="items-center gap-2">
                            <Icon as={User} className="text-purple-600" size="xs" />
                            <VStack className="gap-0.5">
                              <Text className="text-purple-600 text-xs font-medium">Gender</Text>
                              <Text className="text-purple-900 text-sm font-semibold">{offer.gender}</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      )}

                      {/* Additional Positions */}
                      {offer.posDeck && (
                        <Box className="bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2">
                          <Text className="text-secondary-900 text-sm font-semibold">{offer.posDeck}</Text>
                        </Box>
                      )}

                      {offer.positionSpecial && (
                        <Box className="bg-warning-50 border border-warning-200 rounded-lg px-3 py-2">
                          <HStack className="items-center gap-2">
                            <Icon as={Award} className="text-warning-600" size="xs" />
                            <Text className="text-warning-900 text-sm font-semibold">{offer.positionSpecial}</Text>
                          </HStack>
                        </Box>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {/* Vessel Information */}
              {(offer.positionArm || offer.latArm !== 0) && (
                <Box className="bg-white rounded-2xl p-5 shadow-sm">
                  <HStack className="items-center gap-2 mb-3">
                    <Icon as={MapPin} className="text-primary-600" size="md" />
                    <Heading size="md" className="text-primary-600">
                      Location
                    </Heading>
                  </HStack>

                  {offer.positionArm && (
                    <Box className="bg-primary-50 rounded-lg p-3">
                      <Text className="text-primary-900 font-semibold text-base">{offer.positionArm}</Text>
                    </Box>
                  )}
                </Box>
              )}

              {/* Expiration */}
              <Box className="bg-background-100 rounded-xl p-4 border border-outline-200">
                <HStack className="items-center gap-2">
                  <Icon as={Clock} className="text-typography-500" size="sm" />
                  <Text className="text-typography-600 text-xs">
                    Offer expires:{' '}
                    <Text className="font-semibold text-typography-900">{offer.offertExpirationdate}</Text>
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ScrollView>
          {/* FIXED BOTTOM ACTIONS */}
          <Box className="bg-white border-t border-outline-100 p-4 shadow-2xl">
            <VStack className="gap-3">
              {/* Apply Button - Only if applicable and not already applied */}
              {offer.offerApplicable && !offer.alreadyApplied && (
                <Button
                  size="lg"
                  variant="solid"
                  action="positive"
                  onPress={console.log}
                  isDisabled={applying}
                  className="rounded-xl"
                >
                  <ButtonIcon as={Send} />
                  <ButtonText className="ml-2">{applying ? 'Applying...' : 'Apply for this position'}</ButtonText>
                </Button>
              )}

              {/* Already Applied - Show status */}
              {offer.alreadyApplied && (
                <Box className="bg-success-100 rounded-xl p-4">
                  <HStack className="items-center justify-center gap-2">
                    <Icon as={CheckCircle} className="text-success-700" size="md" />
                    <Text className="text-success-900 font-bold text-base">Application Sent</Text>
                  </HStack>
                </Box>
              )}

              {/* Share Button - Always available */}
              <Button size="lg" variant="outline" action="secondary" onPress={console.log} className="rounded-xl">
                <ButtonIcon as={Share2} />
                <ButtonText className="ml-2">Share this offer</ButtonText>
              </Button>
            </VStack>
          </Box>
        </View>
      )}
    </>
  )
}
