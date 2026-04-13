import React, { useMemo } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TUserRole } from '@/api/types'
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
    <ScreenContainer className="justify-center items-center px-6">
      <VStack space="lg" className="items-center">
        <Heading className="text-center text-3xl text-primary-600">{t('guest-welcome')}</Heading>
        <Text className="text-center text-typography-600 text-base">{t('guest-subtitle')}</Text>
        <Button size="lg" className="w-full mt-4 justify-center" onPress={() => router.navigate('/(tabs)/jobs')}>
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

  const photoUrl = useMemo(() => `https://www.marineria.it/PROFoto/${user?.namephotoA}.jpg`, [user])

  return (
    <ScreenContainer className="justify-center items-center px-2">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
              <Box className="mb-4">
                <Avatar size="xl">
                  {role == TUserRole.CREW && user.namephotoA ? (
                    <AvatarImage
                      source={{
                        uri: photoUrl,
                      }}
                    />
                  ) : (
                    <AvatarFallbackText>{`${user.name} ${user.surname} `}</AvatarFallbackText>
                  )}
                </Avatar>
              </Box>
              <Box>
                <Heading className="text-center text-4xl">{t('welcome')}</Heading>
                <Heading className="text-4xl text-center">{user.surname}</Heading>
                <Text className="text-xl p4 text-center my-6">
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
