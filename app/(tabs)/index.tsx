import React, { useMemo } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TUserRole } from '@/api/types'
import { getPhotoUrl } from '@/api/consts'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
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
import { ScreenContainer } from '@/components/appUI'

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
  const { auth } = useSession()
  const { role } = auth
  const { user, isLoading } = useUser()
  const isRecruiter = role == TUserRole.CREW

  const photoName = useMemo(() => user?.namephotoA || user?.namephotoB || user?.namephotoC, [user])
  const photoUrl = useMemo(() => (photoName ? getPhotoUrl(photoName) : null), [photoName])

  return (
    <ScreenContainer className="items-center justify-center px-2">
      {isLoading ? (
        <Loading />
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
  const { isGuest } = useSession()
  return isGuest ? <GuestWelcome /> : <UserProfile />
}

export default HomeScreen
