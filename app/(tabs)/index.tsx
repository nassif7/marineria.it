import React, { useMemo, useState } from 'react'
import { Linking } from 'react-native'
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
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Icon,
  Link,
  LinkText,
} from '@/components/ui'
import { X } from 'lucide-react-native'
import { ErrorMessage, List, EmptyList, ScreenContainer } from '@/components/appUI'
import OfferListItem from '@/components/pro/offers/offerList/OfferListItem'

const GuestOfferList = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'login-screen', 'common'])
  const [showLoginModal, setShowLoginModal] = useState(false)

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
          renderItem={({ item }) => (
            <OfferListItem offer={item} hideStatus key={item.reference} onViewOffer={() => setShowLoginModal(true)} />
          )}
          listEmptyComponent={<EmptyList message={t('no-offers')} />}
        />
      )}
      {isError && <ErrorMessage />}

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <ModalBackdrop />
        <ModalContent className="w-full rounded-md mb-0 mt-auto">
          <ModalHeader className="justify-between items-center">
            <Heading size="xl">{t('view-offer')}</Heading>
            <ModalCloseButton onPress={() => setShowLoginModal(false)}>
              <Icon as={X} className="text-typography-500" size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text className="text-typography-600 text-base">{t('login-to-view-offer', { ns: 'offer-screen' })}</Text>
          </ModalBody>
          <ModalFooter>
            <Box className="w-full gap-3">
              <Button
                size="md"
                className="w-full rounded-xl"
                onPress={() => {
                  setShowLoginModal(false)
                  router.replace('/sign-in')
                }}
              >
                <ButtonText>{t('login', { ns: 'settings-screen' })}</ButtonText>
              </Button>
              <Box className="items-center gap-2">
                <Link onPress={() => Linking.openURL('https://www.marineria.it/En/Pro/Reg.aspx')}>
                  <LinkText>{t('register-as-crew', { ns: 'login-screen' })}</LinkText>
                </Link>
                <Link onPress={() => Linking.openURL('https://www.marineria.it/En/Rec/Reg.aspx')}>
                  <LinkText>{t('register-as-recruiter', { ns: 'login-screen' })}</LinkText>
                </Link>
              </Box>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
