// import { View, ImageBackground } from 'react-native'

import React, { useState, useEffect, useMemo } from 'react'
import { AuthTypes } from '@/api/types'
import { useTranslation } from 'react-i18next'
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
  View,
} from '@/components/ui'
import { router } from 'expo-router'
import { ScreenContainer } from '@/components/appUI'

const UserProfile = () => {
  const { t } = useTranslation(['home-screen'])
  const { auth } = useSession()
  const { role } = auth
  const { user, isLoading } = useUser()
  const isRecruiter = role == AuthTypes.UserRole.CREW

  const photoUrl = useMemo(() => `https://www.marineria.it/PROFoto/${user?.namephotoA}.jpg`, [user])

  return (
    <ScreenContainer className="justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
              <Box className="mb-4">
                <Avatar size="xl">
                  {role == AuthTypes.UserRole.CREW && user.namephotoA ? (
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
                  {role == AuthTypes.UserRole.RECRUITER && t('recruiter-message')}
                  {role == AuthTypes.UserRole.CREW && t('crew-message')}
                </Text>

                <Button
                  variant="solid"
                  onPress={() => router.navigate(`/(tabs)/${isRecruiter ? 'pro/offers' : 'recruiter/search'}`)}
                >
                  <ButtonText className="font-bold">
                    {role == AuthTypes.UserRole.RECRUITER && t('manage-search')}
                    {role == AuthTypes.UserRole.CREW && t('job-list')}
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

export default UserProfile
