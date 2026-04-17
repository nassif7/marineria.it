import React from 'react'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import { useTranslation } from 'react-i18next'
import { Globe, Bell } from 'lucide-react-native'
import { router } from 'expo-router'
import { TUserRole } from '@/api/types'
import { TLocales } from '@/localization'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import { Box, VStack, Heading, HStack, Icon, Button, ButtonText, Link, LinkText } from '@/components/ui'
import SwitchLanguage from '@/components/common/SwitchLanguage'
import NotificationsToggle from '@/components/common/NotificationsToggle'
import SignOut from '@/components/common/SignOut'
import SwitchUser from '@/components/common/SwitchUser'
import { ScreenContainer } from '@/components/appUI'

const Settings = () => {
  const {
    i18n: { language, changeLanguage },
    t,
  } = useTranslation('settings-screen')
  const {
    auth: { role },
    signOut,
    isGuest,
  } = useSession()

  const { user, togglePushNotifications, isTogglingNotifications } = useUser()
  const handleRegisterAsCrew = () => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')
  const handleRegisterAsRecruiter = () => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')
  const privacyPolicyUrl =
    language === TLocales.IT ? 'https://www.marineria.it/it/contacts.aspx' : 'https://www.marineria.it/En/Contacts.aspx'
  const handlePrivacyPolicy = () => WebBrowser.openBrowserAsync(privacyPolicyUrl)
  const pushNotificationToken = user?.pushNotificationToken
  const languageOptions = [
    { label: t(TLocales.EN), value: TLocales.EN },
    { label: t(TLocales.IT), value: TLocales.IT },
  ]

  const handleLanguageChange = async (v: string) => {
    changeLanguage(v.toLocaleLowerCase())
    await SecureStore.setItemAsync('language', v.toLocaleLowerCase())
  }

  return (
    <ScreenContainer className="px-2">
      <VStack className="h-full justify-between py-4">
        <VStack space="sm">
          <HStack className="justify-between items-center bg-white rounded-md p-3 mb-5 border border-background-300 min-h-[60px]">
            <HStack className="items-center" space="sm">
              <Icon as={Globe} className="text-typography-600" size="md" />
              <Heading size="sm" className="text-typography-600">
                {t('change-language')}
              </Heading>
            </HStack>
            <SwitchLanguage
              language={language as TLocales}
              onLanguageChange={handleLanguageChange}
              initialLabel={t(language)}
              languageOptions={languageOptions}
            />
          </HStack>

          {!isGuest && (
            <HStack className="justify-between items-center bg-white rounded-md p-3 mb-5 border border-background-300 min-h-[60px] ">
              <HStack className="items-center" space="sm">
                <Icon as={Bell} className="text-typography-600" size="md" />
                <Heading size="sm" className="text-typography-600">
                  {t('notifications')}
                </Heading>
              </HStack>
              <NotificationsToggle
                enabled={!!pushNotificationToken}
                handleSetPushNotification={togglePushNotifications}
                isPending={isTogglingNotifications}
              />
            </HStack>
          )}
        </VStack>

        <VStack>
          <Box className="p-6">
            {isGuest ? (
              <VStack space="md">
                <Button size="lg" onPress={() => router.replace('/sign-in')}>
                  <ButtonText>{t('login')}</ButtonText>
                </Button>
                <VStack space="xs" className="items-center">
                  <Link onPress={handleRegisterAsCrew}>
                    <LinkText>{t('register-as-crew', { ns: 'login-screen' })}</LinkText>
                  </Link>
                  <Link onPress={handleRegisterAsRecruiter}>
                    <LinkText>{t('register-as-recruiter', { ns: 'login-screen' })}</LinkText>
                  </Link>
                </VStack>
              </VStack>
            ) : (
              <VStack>
                <Box className="mb-4">
                  <SwitchUser />
                </Box>
                <Box>
                  <SignOut buttonLabel={t('logout')} handleLogout={async () => await signOut(role as TUserRole)} />
                </Box>
              </VStack>
            )}
          </Box>
          <Link onPress={handlePrivacyPolicy} className="self-start px-6 pb-3">
            <LinkText className="text-primary-500 text-sm">{t('privacy-policy')}</LinkText>
          </Link>
        </VStack>
      </VStack>
    </ScreenContainer>
  )
}

export default Settings

Settings.displayName = 'Settings'
