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
  VStack,
} from '@/components/ui-lib'
import { router } from 'expo-router'

const UserProfile: React.FC = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation()
  const { auth } = useSession()

  // const proToken = auth[AuthTypes.UserRole.PRO]
  // const ownerToken = auth[AuthTypes.UserRole.OWNER]
  // const hasBothTokens = proToken && ownerToken
  const { role, token } = auth
  const { user, isLoading, activeProfile } = useUser()

  const date = new Date()
  const hours = date.getHours()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (hours < 12) {
      setMessage('morningGreeting')
    } else if (hours < 18) {
      setMessage('afternoonGreeting')
    } else {
      setMessage('eveningGreeting')
    }
  }, [])

  const photoUrl = useMemo(() => `https://www.marineria.it/PROFoto/${user?.namephotoA}.jpg`, [user])

  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        <Box className="">
          {user && (
            <VStack>
              <Box className="items-center mb-4">
                <Avatar className="bg-primary-600 rounded-full" size="xl">
                  {role == AuthTypes.UserRole.PRO && user.namephotoA ? (
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
              <Box className="p4 mb-4 text-center">
                <Heading className="text-white text-4xl p4 text-center">{t(message)}</Heading>
                <Heading className="text-white text-4xl p4 text-center">{user.name}</Heading>
                <Text className="text-white text-xl p4 text-center mb-4">
                  {role == AuthTypes.UserRole.OWNER && t('welcomeOwner')}
                  {role == AuthTypes.UserRole.PRO && t('welcomeCrew')}
                </Text>
                <Button variant="outline">
                  <ButtonText className="text-white" onPress={() => router.navigate(`/(tabs)/jobOffers`)}>
                    {t('jobOffers')}
                  </ButtonText>
                </Button>
              </Box>
            </VStack>
          )}
        </Box>
      )}
    </View>
  )
}

export default UserProfile
