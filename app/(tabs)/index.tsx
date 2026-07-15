import React, { useMemo } from 'react'
import { View, Text as RNText, Pressable, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { C } from '@/components/pro/tokens'
import RecruiterProfile from '@/components/recruiter/profile/RecruiterProfile'
import CrewProfile from '@/components/crew/profile/CrewProfile'

const LOGO_BADGE_W = 240
const LOGO_BADGE_H = 108
const STARS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 41 + 9) % (LOGO_BADGE_W - 6),
  top: (i * 23 + 7) % (LOGO_BADGE_H - 6),
  size: ((i % 3) + 1) * 1.4,
  opacity: 0.25 + ((i * 13) % 45) / 100,
}))

const GuestWelcome = () => {
  const { t } = useTranslation('home-screen')
  const { top } = useSafeAreaInsets()
  return (
    <View style={gw.container}>
      <View style={[gw.logoShadow, { marginTop: top + 48 }]}>
        <View style={gw.logoBadge}>
          <LinearGradient
            colors={['#FF8A50', C.orange, C.orangeText]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {STARS.map((star, i) => (
            <View
              key={i}
              pointerEvents="none"
              style={[
                gw.star,
                {
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                  opacity: star.opacity,
                },
              ]}
            />
          ))}
          <Image source={require('@/assets/images/marineria_logo.png')} style={gw.logo} resizeMode="contain" />
        </View>
      </View>
      <View style={gw.content}>
        <RNText style={gw.subtitle}>{t('guest-subtitle')}</RNText>
        <Pressable style={gw.cta} onPress={() => router.navigate('/(tabs)/jobs')}>
          <RNText style={gw.ctaText}>{t('browse-offers')}</RNText>
        </Pressable>
        <View style={gw.divider} />
        <RNText style={gw.secondarySubtitle}>{t('find-your-crew-subtitle')}</RNText>
        <Pressable style={gw.secondaryCta} disabled>
          <RNText style={gw.secondaryCtaText}>{t('find-your-crew')}</RNText>
          <View style={gw.comingSoonBadge}>
            <RNText style={gw.comingSoonText}>{t('crew-profile.coming-soon')}</RNText>
          </View>
        </Pressable>
        <Pressable style={gw.signInRow} onPress={() => router.replace('/sign-in')}>
          <RNText style={gw.signInText}>{t('already-have-account')}</RNText>
          <RNText style={gw.signInLink}>{t('login', { ns: 'settings-screen' })}</RNText>
        </Pressable>
      </View>
    </View>
  )
}

const gw = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoShadow: {
    width: LOGO_BADGE_W,
    height: LOGO_BADGE_H,
    borderRadius: 20,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 40,
  },
  logoBadge: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 190,
    height: 64,
  },
  subtitle: {
    fontSize: 13,
    color: C.ink3,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 28,
  },
  cta: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: C.hair,
    marginTop: 28,
  },
  secondarySubtitle: {
    fontSize: 13,
    color: C.ink3,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 20,
    marginBottom: 14,
  },
  secondaryCta: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: C.field,
    borderWidth: 1,
    borderColor: C.hair,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.6,
  },
  secondaryCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink3,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.orangeText,
    letterSpacing: 0.2,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    padding: 6,
  },
  signInText: {
    fontSize: 16,
    color: C.ink2,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '800',
    color: C.orange,
  },
})

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
  if (auth.role === TUserRole.CREW) return <CrewProfile />
  return <UserProfile />
}

export default HomeScreen
