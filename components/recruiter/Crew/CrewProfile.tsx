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
  ButtonGroup,
  Text,
  Button,
  ButtonIcon,
  Image,
  Divider,
} from '@/components/ui'
import { Plus, Check } from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import { getAge } from '@/utils/dateUtils'
const CrewProfile = () => {
  const { t } = useTranslation()
  const { crewId, offerId } = useLocalSearchParams()
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const fetchCV = useCallback(async () => {
    const res = await getCrewCV(token, crewId as string)
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
        <ScrollView>
          <VStack className="p-2 rounded-lg bg-white">
            <Box className="mb-2">
              <Heading size="2xl" className="text-primary-600 font-bold">
                {t('crew.profile')}: {cv?.iduser}
              </Heading>
              <HStack className="w-full flex-row justify-between">
                <Text size="md">
                  {t('crew.registration-date')}: {cv?.registraton_date}
                </Text>
                <Text>
                  {t('crew.last-seen')}: {cv?.lastAccessDate}
                </Text>
              </HStack>
            </Box>
            <Box className="mb-2">
              <Image
                size="none"
                className="aspect-[328/328] w-full rounded-lg"
                source={{
                  uri: fakerImage,
                }}
                alt="image"
              />
            </Box>
            <Box>
              <Heading>{cv?.mainPosition}</Heading>
              <Text italic size="xl">
                {cvOtherPositions}
              </Text>
              <Divider className="my-2" />
              <Heading>
                {t('crew.job-offers-received')}: {cv?.numberClicked ?? 0}
              </Heading>
              <Heading>
                {t('crew.citizenship')}: {cv?.passport}
              </Heading>
              <Heading>
                {t('crew.current-location')}: {cv?.city}
                {/* this will be current location */}
              </Heading>
              <Heading>
                {t('crew.salary')}: {cv?.salary}
              </Heading>
            </Box>
            <Divider className="my-2" />
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.personal-data')}
                </Heading>
                <Text size="xl">
                  {cv?.maritalStatus}, {cv?.smoker}, {getAge(cv?.birthYear as string)}
                </Text>
                <Text size="xl">
                  {t('crew.resident-location')}: {cv?.address}
                  {/* This will be city province country */}
                </Text>
              </VStack>
            </Box>
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.sea-experience')}
                </Heading>
                <Text size="xl">{cv?.navigationPerformed}</Text>
                <Text size="xl">{cv?.navigationBook}</Text>
              </VStack>
            </Box>
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.seamans-book')}
                </Heading>
                <Text size="xl">{cv?.registration_Category}</Text>
                <Text size="xl">{cv?.registration_City}</Text>
                <Text size="xl">{cv?.qualificationCode}</Text>
              </VStack>
            </Box>
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.education')}, {t('crew.languages')}
                </Heading>
                {/* this will be education or study */}
                <Text size="xl">{cv?.courses}</Text>
                <Text size="xl">{cvLanguages}</Text>

                {/* Refrences */}
                {/* Certificates of Competency */}
              </VStack>
            </Box>
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.IMO-courses')}
                </Heading>
                <Text size="xl">{cv?.courses}</Text>
              </VStack>
            </Box>
            <Box className="mb-2">
              <VStack>
                <Heading className="text-primary-600" size="md">
                  {t('crew.boat-license')}
                </Heading>
                <Text size="xl">{cv?.licenseCode}</Text>
                {/* Sailboat experience */}
              </VStack>
            </Box>
            <ButtonGroup className="justify-between p-3">
              <Button className="rounded" onPress={onAccept} action="positive">
                <ButtonText>{t('accept')}</ButtonText>
                <ButtonIcon as={Check} />
              </Button>
              <Button onPress={onReject} action="negative">
                <ButtonText>{t('decline')}</ButtonText>
                <ButtonIcon as={Plus} />
              </Button>
            </ButtonGroup>
          </VStack>
        </ScrollView>
      )}
    </>
  )
}

export default CrewProfile
