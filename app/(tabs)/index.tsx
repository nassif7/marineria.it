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

const UserProfile = () => {
  const { t } = useTranslation()
  const { auth } = useSession()

  const { role } = auth
  const { user, isLoading } = useUser()

  const isRecruiter = role == AuthTypes.UserRole.PRO

  const date = new Date()
  const hours = date.getHours()
  const [message, setMessage] = useState('')
  const [showAlertDialog, setShowAlertDialog] = React.useState(false)
  const handleClose = () => setShowAlertDialog(false)

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
    <View className="h-full justify-center items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user && (
            <>
              <Box className="mb-4">
                <Avatar size="xl">
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
              <Box>
                <Heading className="text-white text-center text-4xl">{t(message)}</Heading>
                <Heading className="text-white text-4xl text-center">{user.name}</Heading>
                <Text className="text-white text-xl p4 text-center my-6">
                  {role == AuthTypes.UserRole.OWNER && t('welcomeOwner')}
                  {role == AuthTypes.UserRole.PRO && t('welcomeCrew')}
                </Text>

                <Button
                  variant="outline"
                  onPress={() => router.navigate(`/(tabs)/${isRecruiter ? 'pro/offers' : 'recruiter/search'}`)}
                >
                  <ButtonText className="text-white">{t('jobOffers')}</ButtonText>
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </View>
  )
}

export default UserProfile
