import React, { useCallback, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getCrewCV, selectProUser, rejectProUser } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useFetch } from '@/hooks'
import {
  Loading,
  ButtonText,
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  ButtonIcon,
  Image,
  Icon,
} from '@/components/ui'
import { Award, Check, X, FileText, Anchor, GraduationCap } from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import { getAgeByYear } from '@/utils/dateUtils'
import CrewExperienceList from '@/components/recruiter/Crew/CrewExperienceList'
import CrewReferences from '@/components/recruiter/Crew/CrewReferences'
import CrewInfoCard from '@/components/recruiter/Crew/CrewInfoCard'
import CrewKeyInfoGrid from '@/components/recruiter/Crew/CrewKeyInfoGrid'

const CrewProfile = () => {
  const { t } = useTranslation()
  const { crewId, offerId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const fetchCV = useCallback(async () => {
    const res = await getCrewCV(token, '50000' as string)
    return res
  }, [crewId])

  const { isLoading, data } = useFetch(fetchCV)
  const cv = data?.[0]
  const onAccept = async () => {
    const res = await selectProUser(token, crewId as string, offerId as string)
  }
  const onReject = async () => {
    const res = await rejectProUser(token, crewId as string, offerId as string)
  }
  const photoUrl = useMemo(() => `https://www.marineria.it/PROFoto/${cv?.namephotoA}`, [cv])
  const fakerImage = useMemo(() => faker.image.personPortrait({ size: 256 }), [cv])
  const cvOtherPositions = useMemo((): string => {
    const positions = [cv?.pos_deck, cv?.pos_engine, cv?.pos_hotel, cv?.pos_harbour, cv?.pos_special].filter((p) => !!p)
    return positions.length === 0 ? '' : positions.length === 1 ? (positions[0] as string) : positions.join(', ')
  }, [cv])

  const cvLanguages = useMemo((): string => {
    const languages = [cv?.language1, cv?.language2, cv?.language3, cv?.language4].filter((l) => !!l)
    return languages.length === 0 ? '' : languages.length === 1 ? (languages[0] as string) : languages.join(', ')
  }, [cv])

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && cv && (
        <Box className="flex-1 relative ">
          <ScrollView className="bg-background-50 rounded-lg">
            <VStack className="gap-4 p-3 pb-24">
              {/* Header Card */}
              <Box className="bg-white rounded-lg p-3 shadow-sm">
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
              <Box className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Image
                  size="none"
                  className="aspect-square w-full"
                  source={{ uri: fakerImage }}
                  alt="profile picture"
                />
              </Box>
              {/* Position Card */}
              <Box className="bg-white rounded-lg p-3 shadow-sm">
                <VStack className="gap-3">
                  <VStack className="gap-1">
                    <Text className="text-typography-500 text-sm  font-medium  tracking-wide">
                      {t('crew.main-position')}
                    </Text>
                    <Heading size="lg" className="text-typography-900">
                      {cv?.mainPosition}
                    </Heading>
                  </VStack>

                  {cvOtherPositions && <Text className="text-typography-600 italic text-base">{cvOtherPositions}</Text>}
                </VStack>
              </Box>

              <CrewKeyInfoGrid
                numberClicked={cv?.numberClicked ?? null}
                salary={cv?.salary}
                passport={cv?.passport ?? ''}
                currentPosition={cv?.currentPosition ?? ''}
              />
              {/* Personal Data */}
              <Box className="bg-white rounded-2xl p-3 shadow-sm">
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
              <Box className="bg-white rounded-2xl p-3 shadow-sm">
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
              <Box className="bg-white rounded-2xl p-3 shadow-sm">
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
              <Box className="bg-white rounded-2xl p-3 shadow-sm">
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
              <CrewReferences references={cv?.approvedReferences} />
              {/* IMO Courses */}
              <CrewInfoCard icon={Award} title={t('crew.IMO-courses')} content={cv?.courses} />
              {/* Boat License */}
              <CrewInfoCard icon={FileText} title={t('crew.boat-license')} content={cv?.licenseCode} />

              <CrewExperienceList experiences={cv?.experiences} calculatedExperience={cv?.calculatedExperience} />
            </VStack>
          </ScrollView>
          {/* Action Buttons - Fixed at bottom */}
          <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-outline-100 p-3 shadow-lg rounded-lg">
            <HStack className="gap-3">
              <Button className="flex-1 rounded-lg" onPress={onAccept} action="positive" size="lg">
                <ButtonIcon as={Check} />
                <ButtonText className="ml-2">{t('get')}</ButtonText>
              </Button>
              <Button className="flex-1 rounded-lg" onPress={onReject} action="negative" size="lg">
                <ButtonIcon as={X} />
                <ButtonText className="ml-2">{t('decline')}</ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  )
}

export default CrewProfile
