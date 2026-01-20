import React, { useCallback, useMemo } from 'react'
import { View, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { getCrewCV, selectProUser, rejectProUser } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { useAppState, useFetch } from '@/hooks'
import {
  Loading,
  ListEmptyComponent,
  ButtonText,
  Box,
  Heading,
  Card,
  VStack,
  HStack,
  ButtonGroup,
  Text,
  Button,
  ButtonIcon,
  Image,
} from '@/components/ui'
import { Plus, Check } from 'lucide-react-native'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'

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

  const OtherPositions = (): string => {
    const positions = [cv?.pos_deck, cv?.pos_engine, cv?.pos_hotel, cv?.pos_harbour, cv?.pos_special].filter((p) => !!p)
    return positions.length === 0 ? '' : positions.length === 1 ? (positions[0] as string) : positions.join(', ')
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && data && (
        <ScrollView>
          <VStack className="p-2 rounded-lg bg-white">
            <Box className="mb-2">
              <Heading size="2xl" className="text-primary-600 font-bold">
                {t('crew.profile')}: {cv?.iduser}
              </Heading>
              <HStack className="w-full flex-row justify-between">
                <Text size="sm">Registered: {cv?.registraton_date}</Text>
                <Text size="sm">Last seen: {cv?.lastAccessDate}</Text>
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
              <Heading size="xl" className="mb-2">
                {cv?.mainPosition}
              </Heading>
              <Text>{OtherPositions()}</Text>
              <Heading>Job Offers Received: {cv?.numberClicked}</Heading>
              <Heading>Nationality: </Heading> {cv?.passport}
              <Heading>Current Location:</Heading> {cv?.province}
            </Box>
            <Box className="border-2 border-outline-200 rounded p-2 ">
              <VStack>
                <Heading className="text-primary-600" size="md"></Heading>
                <HStack className="justify-between">
                  <Heading size="sm"></Heading>
                </HStack>
                <HStack className="justify-between">
                  <Heading size="sm">jj{cv?.iduser}</Heading>
                </HStack>
              </VStack>
            </Box>
            <Box className="mt-4 flex-col border-2 border-outline-200 rounded p-2 ">
              <Heading size="sm"></Heading>
            </Box>
            <ButtonGroup className="justify-between p-3">
              <Button className="rounded" onPress={onAccept} action="positive">
                <ButtonText>Accept</ButtonText>
                <ButtonIcon as={Check} />
              </Button>
              <Button onPress={onReject} action="negative">
                <ButtonText>Reject</ButtonText>
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
