import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getCrewCV, selectProUser, declineProUser } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import {
  Loading,
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Icon,
  View,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
  Pressable,
} from '@/components/ui'
import { Award, FileText, Anchor, GraduationCap, X } from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import { getAgeByYear } from '@/utils/dateUtils'
import * as CrewDetails from './crewDetails'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

const CrewProfile = () => {
  const [showContact, setShowContact] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
  const { crewid, searchId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const queryClient = useQueryClient()
  const { isFetching, isSuccess, data } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId],
    queryFn: () => getCrewCV(token, crewid as string),
  })
  const cv = isSuccess ? (data as any)?.[0] : null
  const photoUrl = useMemo(() => `https://www.marineria.it/PROFoto/${cv?.namephotoA}`, [cv])
  const fakerImage = useMemo(() => faker.image.personPortrait({ size: 256 }), [cv])

  const cvLanguages = useMemo((): string => {
    const languages = [cv?.language1, cv?.language2, cv?.language3, cv?.language4].filter((l) => !!l)
    return languages.length === 0 ? '' : languages.length === 1 ? (languages[0] as string) : languages.join(', ')
  }, [cv])

  const otherPositions = [
    { label: t('crew.deck'), value: cv?.pos_deck },
    { label: t('crew.engine'), value: cv?.pos_engine },
    { label: t('crew.harbour'), value: cv?.pos_harbour },
    { label: t('crew.hotel'), value: cv?.pos_hotel },
    { label: t('crew.special'), value: cv?.pos_special },
  ].filter((p) => p.value)

  const toast = useToast()
  const [toastId, setToastId] = React.useState(0)
  const handleToast = (emphasize: 'success' | 'error', action?: 'decline' | 'accept') => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(emphasize, action)
    }
  }

  const showNewToast = (emphasize: 'success' | 'error', action?: 'decline' | 'accept') => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id
        return (
          <Toast
            action={emphasize}
            variant="solid"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-80  max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              <VStack space="xs">
                {emphasize === 'error' && <ToastTitle className="font-semibold">{'Error'}</ToastTitle>}
                <ToastDescription size="md">
                  {emphasize === 'error'
                    ? t('unknown-error')
                    : action === 'decline'
                      ? t('recruiter.crew-deleted', { profileId: crewid })
                      : t('recruiter.crew-accepted', {
                          profileId: crewid,
                          salutation: cv?.gender === 'Female' ? t('female-salutation') : t('male-salutation'),
                          lastName: cv?.surname,
                        })}
                </ToastDescription>
              </VStack>
            </HStack>
            <HStack className="min-[450px]:gap-3 gap-1">
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={X} />
              </Pressable>
            </HStack>
          </Toast>
        )
      },
    })
  }

  const handleAccept = useMutation({
    mutationFn: () => {
      setIsLoading(true)
      return selectProUser(token, crewid as string, searchId as string)
    },
    onSuccess: () => {
      setIsLoading(false)
      setShowContact(true)
      handleToast('success', 'accept')
    },
    onError: () => {
      setIsLoading(false)
      handleToast('error')
    },
  })

  const handleDecline = useMutation({
    mutationFn: () => {
      setIsLoading(true)
      return declineProUser(token, crewid as string, searchId as string)
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        {
          queryKey: ['recruiter-crew-list', searchId],
          exact: true,
          refetchType: 'active',
        },
        {}
      )
      setIsLoading(false)
      handleToast('success', 'decline')
      router.dismiss()
    },
  })

  return (
    <>
      {(isFetching || isLoading) && <Loading />}
      {isSuccess && (
        <Box className="flex-1 relative ">
          <ScrollView className="bg-background-50 rounded-lg">
            <VStack className="gap-4 p-2 pb-24 ">
              {/* Header Card */}
              <Box className="bg-white rounded-lg p-3  ">
                <VStack className="gap-3">
                  <HStack className="justify-between items-start">
                    <VStack className="gap-1 flex-1">
                      <Text className="text-typography-500 text-sm  tracking-wide">{t('crew.profile')}</Text>
                      <Heading size="xl" className="text-primary-600">
                        ID: {cv?.iduser}
                      </Heading>
                    </VStack>
                  </HStack>

                  <HStack className="gap-3 flex-wrap">
                    <Box className="bg-background-100 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
                      <Text className="text-typography-500 text-sm  mb-0.5">{t('crew.registration-date')}</Text>
                      <Text className="text-typography-900 font-semibold text-sm">{cv?.registraton_date}</Text>
                    </Box>
                    <Box className="bg-background-100 rounded-lg px-3 py-2 flex-1 min-w-[45%]">
                      <Text className="text-typography-500 text-sm  mb-0.5">{t('crew.last-seen')}</Text>
                      <Text className="text-typography-900 font-semibold text-sm">{cv?.lastAccessDate}</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>
              {/* Profile Image */}
              <Box className="bg-white rounded-lg overflow-hidden  ">
                <Image
                  size="none"
                  className="aspect-square w-full"
                  source={{ uri: fakerImage }}
                  alt="profile picture"
                />
              </Box>
              {showContact && (
                <CrewDetails.ContactCard email={cv?.email} phone={cv?.cellular} whatsapp={cv?.callWhatsapp} />
              )}
              <CrewDetails.PositionsCard mainPosition={cv?.mainPosition} otherPositions={otherPositions} />
              <CrewDetails.KeyInfoGrid
                numberClicked={cv?.numberClicked ?? null}
                salary={cv?.salary}
                passport={cv?.passport ?? ''}
                currentPosition={cv?.currentPosition ?? ''}
              />
              {/* Personal Data */}
              <Box className="bg-white rounded-xl p-3  ">
                <Heading size="md" className="text-primary-600 mb-3">
                  {t('crew.personal-data')}
                </Heading>
                <VStack className="gap-2">
                  <HStack className="gap-2 flex-wrap">
                    <Box className="bg-background-50 rounded-lg px-3 py-2">
                      <Text className="text-typography-700 font-medium">{cv?.maritalStatus}</Text>
                    </Box>
                    <Box className="bg-background-50 rounded-lg px-3 py-2">
                      <Text className="text-typography-700 font-medium">{cv?.smoker}</Text>
                    </Box>
                    <Box className="bg-background-50 rounded-lg px-3 py-2">
                      <Text className="text-typography-700 font-medium">{getAgeByYear(cv?.yearofBirth as string)}</Text>
                    </Box>
                  </HStack>
                  <Box className="mt-2">
                    <Text className="text-typography-500 text-sm  mb-1">{t('crew.resident-location')}</Text>
                    <Text className="text-typography-900 text-base">{cv?.address}</Text>
                  </Box>
                </VStack>
              </Box>
              {/* Sea Experience */}
              <Box className="bg-white rounded-2xl p-3  ">
                <HStack className="items-center gap-2 mb-3">
                  <Icon as={Anchor} className="text-primary-600" size="md" />
                  <Heading size="md" className="text-primary-600">
                    {t('crew.sea-experience')}
                  </Heading>
                </HStack>
                <VStack className="gap-2">
                  <Text className="text-typography-700">{cv?.calculatedExperience}</Text>

                  <Box className="bg-success-50 rounded-lg p-3">
                    <Text className="text-success-900 font-semibold text-base">{cv?.navigationBook}</Text>
                  </Box>
                </VStack>
              </Box>
              {/* Seaman's Book */}
              <Box className="bg-white rounded-2xl p-3  ">
                <Heading size="md" className="text-primary-600 mb-3">
                  {t('crew.seamans-book')}
                </Heading>
                <VStack className="gap-2">
                  <HStack className="items-center gap-2">
                    <Text className="text-typography-500 text-sm">Category:</Text>
                    <Text className="text-typography-900 font-semibold">{cv?.registration_Category}</Text>
                  </HStack>
                  <HStack className="items-center gap-2">
                    <Text className="text-typography-500 text-sm">City:</Text>
                    <Text className="text-typography-900 font-semibold">{cv?.registration_City}</Text>
                  </HStack>
                  <HStack className="items-center gap-2">
                    <Text className="text-typography-500 text-sm">Qualification:</Text>
                    <Text className="text-typography-900 font-semibold">{cv?.qualificationCode}</Text>
                  </HStack>
                </VStack>
              </Box>
              {/* Education & Languages */}
              <Box className="bg-white rounded-2xl p-3  ">
                <HStack className="items-center gap-2 mb-3">
                  <Icon as={GraduationCap} className="text-primary-600" size="md" />
                  <Heading size="md" className="text-primary-600">
                    {t('crew.education')}, {t('crew.languages')}
                  </Heading>
                </HStack>
                <VStack className="gap-3">
                  <Box>
                    <Text className="text-typography-500 text-sm  mb-1">{t('crew.education')}</Text>
                    <Text className="text-typography-900 font-medium">{cv?.educationalLevel}</Text>
                  </Box>
                  <Box>
                    <Text className="text-typography-500 text-sm  mb-1">{t('crew.languages')}</Text>
                    <Text className="text-typography-900 font-medium">{cvLanguages}</Text>
                  </Box>
                </VStack>
              </Box>
              {/* References */}
              <CrewDetails.References references={cv?.approvedReferences} />
              {/* IMO Courses */}
              <CrewDetails.InfoCard icon={Award} title={t('crew.IMO-courses')} content={cv?.courses} />
              {/* Boat License */}
              <CrewDetails.InfoCard icon={FileText} title={t('crew.boat-license')} content={cv?.licenseCode} />
              <CrewDetails.ExperienceList
                experiences={cv?.experiences}
                calculatedExperience={cv?.calculatedExperience}
              />
              <CrewDetails.SkillsGrid
                organizationalSkills={cv?.organizationalSkills}
                relationalSkills={cv?.relationalSkills}
                technicalSkills={cv?.technicalSkills}
                professionalSkills={cv?.professionalSkills}
              />
            </VStack>
          </ScrollView>
          {/* Action Buttons - Fixed at bottom */}
          <CrewDetails.ActionButtons
            onAccept={() => handleAccept.mutate()}
            onDecline={() => handleDecline.mutate()}
            acceptLabel="crew.get-contact"
            declineLabel="crew.delete"
          />
        </Box>
      )}
    </>
  )
}

export default CrewProfile
