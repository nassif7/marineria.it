import React, { useMemo } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import { useQuery } from '@tanstack/react-query'
import { getPublicOffers } from '@/api'
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
} from '@/components/ui'
import { ErrorMessage, List, EmptyList, ScreenContainer } from '@/components/appUI'
import OfferListItem from '@/components/pro/offers/offerList/OfferListItem'

const GuestOfferList = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen'])

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['public-offers'],
    queryFn: () => getPublicOffers(language),
  })

  return (
    <ScreenContainer>
      {(isLoading || isRefetching) && <Loading />}
      {isSuccess && (
        <List
          data={data}
          isRefetching={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => <OfferListItem offer={item} hideStatus key={item.reference} />}
          listEmptyComponent={<EmptyList message={t('no-offers')} />}
        />
      )}
      {isError && <ErrorMessage />}
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
  return isGuest ? <GuestOfferList /> : <UserProfile />
}

export default HomeScreen
