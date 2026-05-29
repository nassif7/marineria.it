import React, { useMemo } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TUserRole } from '@/api/types'
import { getPhotoUrl } from '@/api/consts'
import { parseServerBool } from '@/api/utils'
import { useSession } from '@/Providers/SessionProvider'
import { useCrew } from '@/Providers/CrewProvider'
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Heading,
  Loading,
  Text,
  VStack,
} from '@/components/ui'
import { ScreenContainer, ErrorMessage } from '@/components/appUI'
import RecruiterProfile from '@/components/recruiter/profile/RecruiterProfile'

const GuestWelcome = () => {
  const { t } = useTranslation('home-screen')
  return (
    <ScreenContainer className="items-center justify-center px-6">
      <VStack space="lg" className="items-center">
        <Heading className="text-3xl text-center text-primary-600">{t('guest-welcome')}</Heading>
        <Text className="text-base text-center text-typography-600">{t('guest-subtitle')}</Text>
        <Button size="lg" className="justify-center w-full mt-4" onPress={() => router.navigate('/(tabs)/jobs')}>
          <ButtonText className="flex-1 text-center">{t('browse-offers')}</ButtonText>
        </Button>
      </VStack>
    </ScreenContainer>
  )
}

const UserProfile = () => {
  const { t } = useTranslation(['home-screen'])
  const { auth, signOut } = useSession()
  const { role } = auth
  const { crew: user, isLoading } = useCrew()
  const isError = false
  const isRecruiter = role == TUserRole.CREW
  const isCvListed = role === TUserRole.CREW && parseServerBool(user?.published)

  const photoName = useMemo(() => user?.namephotoA || user?.namephotoB || user?.namephotoC, [user])
  const photoUrl = useMemo(() => (photoName ? getPhotoUrl(photoName) : null), [photoName])

  return (
    <ScreenContainer className="items-center justify-center px-2">
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <VStack space="md" className="items-center px-6">
          <ErrorMessage />
          <Button variant="outline" onPress={() => role && signOut(role)}>
            <ButtonText>{t('sign-out', { ns: 'common', defaultValue: 'Esci' })}</ButtonText>
          </Button>
        </VStack>
      ) : (
        <>
          {user && (
            <>
              <Box className="mb-4">
                <Avatar size="xl">
                  {photoName ? (
                    <AvatarImage
                      source={{
                        uri: photoUrl ?? undefined,
                      }}
                    />
                  ) : (
                    <AvatarFallbackText>{`${user.name} ${user.surname} `}</AvatarFallbackText>
                  )}
                </Avatar>
              </Box>
              <Box>
                <Heading className="text-4xl text-center">{t('welcome')}</Heading>
                <Heading className="text-4xl text-center">{user.surname}</Heading>
                {role === TUserRole.CREW && (
                  <Text
                    className={`text-base text-center font-semibold mt-2 ${isCvListed ? 'text-success-600' : 'text-error-600'}`}
                  >
                    {isCvListed ? t('cv-listed') : t('cv-not-listed')}
                  </Text>
                )}
                <Text className="my-6 text-xl text-center p4">
                  {role == TUserRole.RECRUITER && t('recruiter-message')}
                  {role == TUserRole.CREW && t('crew-message')}
                </Text>

                <Button
                  variant="solid"
                  onPress={() => router.navigate(`/(tabs)/${isRecruiter ? 'pro/offers' : 'recruiter/search'}`)}
                >
                  <ButtonText className="font-bold">
                    {role == TUserRole.RECRUITER && t('manage-search')}
                    {role == TUserRole.CREW && t('job-list')}
                  </ButtonText>
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </ScreenContainer>
  )
}

const HomeScreen = () => {
  const { isGuest, auth } = useSession()
  if (isGuest) return <GuestWelcome />
  if (auth.role === TUserRole.RECRUITER) return <RecruiterProfile />
  return <UserProfile />
}

export default HomeScreen
