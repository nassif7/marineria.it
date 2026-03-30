import { FC, useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Image,
  Badge,
  BadgeText,
  BadgeIcon,
  Button,
  ButtonText,
} from '@/lib/components/ui'
import { User, Calendar, MapPin, Award, Heart, Cake, Cigarette, IdCard, Briefcase } from 'lucide-react-native'
import { TCrewSimple } from '@/api/types'
import { faker } from '@faker-js/faker'
import { useTranslation } from 'react-i18next'
import { SubSection } from '@/lib/components'
import { getAgeByYear } from '@/lib/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'

interface ICrewListItem {
  crew: TCrewSimple
}

const CrewListItem: FC<ICrewListItem> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew'])

  const router = useRouter()
  const { searchId } = useLocalSearchParams()
  const photoUrl = useMemo(() => `https://www.comunicazione.it/PROFoto/${crew?.userPhoto}`, [crew])
  const fakerImage = useMemo(() => faker.image.personPortrait({ size: 256 }), [crew])
  const handlePress = () => {
    router.push(`/recruiter/search/${searchId}/crew/${crew.userId}`)
  }

  const hasSeamansBook = getSeamansBook(crew)
  const { hasCertificateOfCompetence } = getCertificateOfCompetence(crew)

  return (
    <Box className="bg-white rounded-md p-4">
      <VStack space="xs">
        {/* Header: Photo + Name + Status */}
        <HStack className="justify-between  pb-2 items-start border-b border-background-200">
          <HStack className="items-start flex-1" space="sm">
            <Box className="w-16 h-16 rounded-md bg-primary-100 items-center justify-center overflow-hidden">
              {crew.userPhoto ? (
                <Image source={{ uri: fakerImage }} className="w-full h-full" alt="profile" />
              ) : (
                <Icon as={User} className="white" size="xl" />
              )}
            </Box>
            {/* Name and Info */}
            <VStack className="flex-1" space="xs">
              <HStack className="items-center gap-2 flex-wrap">
                <Heading size="sm" className="text-primary-600">
                  {crew.contacted ? crew.firstName + ' ' + crew.lastName : crew.mainPosition}
                </Heading>
              </HStack>
              {crew.contacted && (
                <Text bold size="sm">
                  {crew.mainPosition}
                </Text>
              )}
            </VStack>
          </HStack>
          <Text bold size="sm">
            {t('id')}: {crew.userId}
          </Text>
        </HStack>
        <HStack className="items-start flex-wrap" space="sm">
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">
              {t('citizenship', { ns: 'crew' })}: {crew.passport}
            </BadgeText>
          </Badge>
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{crew.maritalStatus}</BadgeText>
          </Badge>
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{`${getAgeByYear(crew.birthYear)} ${t('years', { ns: 'crew' })}`}</BadgeText>
          </Badge>
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{crew.smoker}</BadgeText>
          </Badge>
          {!crew.calculatedExperience && (
            <Badge action="error" variant="outline" className="rounded-md">
              <BadgeText className="text-error-900">{t('no-experience', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
          <Badge action={hasCertificateOfCompetence ? 'success' : 'error'} variant="outline" className="rounded-md">
            <BadgeText className={`text-${hasCertificateOfCompetence ? 'success' : 'error'}-900`}>
              {t(hasCertificateOfCompetence ? 'certificate-of-competence' : 'no-certificate-of-competence', {
                ns: 'crew-screen',
              })}
            </BadgeText>
          </Badge>
          {!crew.courses && (
            <Badge action="error" variant="outline" className="rounded-md">
              <BadgeText className="text-error-900">{t('no-courses', { ns: 'crew' })}</BadgeText>
            </Badge>
          )}
        </HStack>

        <HStack space="xs">
          <SubSection title={t('available-from', { ns: 'crew' })} icon={Calendar} className="flex-1 ">
            <Text size="sm" semiBold shade={800}>
              {crew.dateAvailability}
            </Text>
          </SubSection>
          <SubSection title={t('city', { ns: 'crew' })} icon={MapPin} className="flex-1 ">
            <Text size="sm" semiBold shade={800}>
              {crew.city}
            </Text>
          </SubSection>
        </HStack>

        {crew.calculatedExperience && (
          <SubSection title={t('experience', { ns: 'crew' })} icon={Briefcase} className=" min-h-[50px] ">
            <HStack className="items-center justify-between flex-wrap">
              <Text size="sm" semiBold shade={800}>
                {crew.calculatedExperience}
              </Text>

              <Badge action={hasSeamansBook ? 'success' : 'error'} variant="outline" className="rounded-md">
                <BadgeText className={`text-${hasSeamansBook ? 'success' : 'error'}-900`}>{crew.seamansBook}</BadgeText>
              </Badge>
            </HStack>
          </SubSection>
        )}
        {crew.courses && (
          <SubSection title={t('courses', { ns: 'crew' })} icon={Award}>
            <Text size="sm" semiBold shade={800}>
              {crew.courses}
            </Text>
          </SubSection>
        )}

        <Button size="md" action="positive" variant="solid" onPress={handlePress}>
          <ButtonText>{t('view-profile')}</ButtonText>
        </Button>
      </VStack>
    </Box>
  )
}

export default CrewListItem
