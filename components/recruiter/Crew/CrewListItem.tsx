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
} from '@/components/ui'
import { Icon, ArrowRightIcon, EyeIcon } from '@/components/ui/icon'
import { faker } from '@faker-js/faker'
import { formatDate, getAge } from '@/utils/dateUtils'
import { BASE_URL } from '@/api/const'
import { useTranslation } from 'react-i18next'

const CrewListItem: React.FC<{ crew: CrewType }> = ({ crew }) => {
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

  console.log(crew.lastAccessDate)
  return (
    <Card className="p-4 rounded-lg m-3">
      <Box className="flex-row  items-center">
        <Avatar className="mr-4">
          <AvatarFallbackText>{`${crew.firstName} ${crew.lastName} `}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: fakerImage,
            }}
          />
        </Avatar>
        <Heading size="lg" className="text-primary-600">
          Profile {crew.userId}
        </Heading>
      </Box>
      <Box className="mt-4 flex-col border-2 border-outline-200 rounded">
        <VStack className="w-full border-b-2 border-outline-200 p-2 bg-outline-50 ">
          <Heading size="md">
            {/* {crew.position} */}
            Master (CoC)
          </Heading>
        </VStack>
        <VStack className="w-full border-b-2 border-outline-200 p-2">
          <Heading size="md" className="text-success-400">
            Available fom: 11/04/2025
            {/* {crew.availability || AvailableFrom} */}
          </Heading>
        </VStack>
        <VStack className="w-full p-2">
          <Text>
            {crewDetailsInfo.martialStatus}, {crewDetailsInfo.smoker}, {getAge(crew.birthYear)} years old
          </Text>
          <Text>From: {crewDetailsInfo.city}</Text>
          <Text>Citizenship: {crewDetailsInfo.citizenship}</Text>
        </VStack>
      </Box>
      <Box className="my-4 flex-col border-2 border-outline-200 rounded">
        <VStack className="w-full border-b-2 border-outline-200 p-2 bg-outline-50 ">
          <Heading size="md">{crew.lastAccessDate}</Heading>
        </VStack>
        <VStack className="w-full p-2">
          {/* missing information */}
          <Text size="md" className="text-success-400">
            IMO Basic Training
          </Text>
          <Text size="md" className="text-success-400">
            Yes Seaman's Book
          </Text>
          <Text size="md" className="">
            Experience: not declared
          </Text>
          <Text size="md" className="">
            35 years on Seaman's Book
          </Text>
          <Text size="md" className="">
            Also skilled as: Bosun Deck Officer Captain
          </Text>
        </VStack>
      </Box>

      <Button className="py-2 px-4" variant="outline" action="positive">
        <Link
          href={`https://www.marineria.it/${language}/CV.aspx/${crew.userId}`}
          isExternal
          className="flex-row items-center w-full justify-center"
        >
          <ButtonIcon as={EyeIcon} className="text-success-400 mr-2" />
          <ButtonText className="text-success-400">Visit Resume</ButtonText>
        </Link>
      </Button>
    </Card>
  )
}

export default CrewListItem
