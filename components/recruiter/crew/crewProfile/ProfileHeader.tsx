import { FC, useState, useMemo, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, VStack, HStack, Heading, Text, Icon, Image, Badge, BadgeText, BadgeIcon } from '@/components/ui'
import { User, MapPin, Heart, Cake, Cigarette, IdCard, Images, Expand } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/appUI'
import { getAgeByYear } from '@/utils/dateUtils'
import { TCrew } from '@/api/types'
import { PhotoSlider } from '@/components/appUI'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'

import { getPhotoUrl } from '@/api/consts'

const ProfileHeader: FC<{ crew: TCrew }> = ({ crew }) => {
  const [photoVisible, setPhotoVisible] = useState(false)
  const { t } = useTranslation(['crew-screen', 'crew'])

  const photos = useMemo(
    () =>
      [...new Set([crew.userPhoto, crew.namephotoA, crew.namephotoB, crew.namephotoC].filter(Boolean))].map((name) =>
        getPhotoUrl(name)
      ),
    [crew]
  )
  const primaryPhoto = photos[0] ?? null

  const hasPhotos = photos.length > 0
  const age = getAgeByYear(crew.yearofBirth)
  const { hasCertificateOfCompetence, certificateOfCompetence } = getCertificateOfCompetence(crew)
  const hasSeamansBook = getSeamansBook(crew)

  return (
    <Section className="mx-0 rounded-none bg-background-200">
      <VStack space="sm" className="items-center">
        <TouchableOpacity
          onPress={() => hasPhotos && setPhotoVisible(true)}
          activeOpacity={hasPhotos ? 0.75 : 1}
          disabled={!hasPhotos}
        >
          <Box className="items-center justify-center overflow-hidden border rounded-md w-28 h-28 bg-primary-100 border-outline-200">
            {primaryPhoto ? (
              <Image source={{ uri: primaryPhoto }} className="w-full h-full" alt="profile" />
            ) : (
              <Icon as={User} size="xl" className="text-primary-400" />
            )}
          </Box>

          {hasPhotos && (
            <Box className="absolute -bottom-1.5 -right-1.5 rounded-full bg-primary-500 items-center justify-center border-2 border-white px-1.5 py-1 flex-row gap-1">
              <Icon as={photos.length > 1 ? Images : Expand} size="xs" className="text-white" />
              {photos.length > 1 && (
                <Text size="xs" bold className="leading-none text-white">
                  {photos.length}
                </Text>
              )}
            </Box>
          )}
        </TouchableOpacity>

        <PhotoSlider visible={photoVisible} photos={photos} onClose={() => setPhotoVisible(false)} initialIndex={0} />
        <VStack space="xs" className="items-center">
          <Heading size="md" className="text-center text-primary-600 ">
            {crew?.contacted === 'True' ? crew.name + ' ' + crew.surname : crew.mainPosition}
          </Heading>
          <HStack space="md">
            <Text size="sm" bold shade={800}>
              {t('id')}: {crew.iduser}
            </Text>
          </HStack>
        </VStack>

        {/* Personal badges */}
        <HStack className="flex-wrap justify-start gap-2">
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">
              {t('citizenship', { ns: 'crew' })}: {crew.passport}
            </BadgeText>
          </Badge>
          {crew.currentPosition && (
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText className="text-typography-800">{crew.currentPosition}</BadgeText>
            </Badge>
          )}
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{crew.maritalStatus}</BadgeText>
          </Badge>
          {age && (
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText className="text-typography-800">{`${age} ${t('years', { ns: 'crew' })}`}</BadgeText>
            </Badge>
          )}
          <Badge action="muted" variant="outline" className="rounded-md">
            <BadgeText className="text-typography-800">{crew.smoker}</BadgeText>
          </Badge>
          {crew.gender && (
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText className="text-typography-800">{crew.gender}</BadgeText>
            </Badge>
          )}
          <Badge action={hasSeamansBook ? 'success' : 'error'} variant="outline" className="rounded-md">
            <BadgeText className={`text-${hasSeamansBook ? 'success' : 'error'}-900`}>{crew.seamansBook}</BadgeText>
          </Badge>
          <Badge action={hasCertificateOfCompetence ? 'success' : 'error'} variant="outline" className="rounded-md">
            <BadgeText className={`text-${hasCertificateOfCompetence ? 'success' : 'error'}-900`}>
              {t(hasCertificateOfCompetence ? 'certificate-of-competence' : 'no-certificate-of-competence', {
                ns: 'crew-screen',
              })}
            </BadgeText>
          </Badge>
        </HStack>
      </VStack>
    </Section>
  )
}

export default memo(ProfileHeader)

ProfileHeader.displayName = 'ProfileHeader'
