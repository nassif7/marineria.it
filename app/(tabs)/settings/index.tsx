import React from 'react'
// import { ImageBackground } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Box, View, VStack, Heading } from '@/components/ui'
import SwitchLanguage from '@/components/SwitchLanguage'
import NotificationsToggle from '@/components/NotificationsToggle'
import SignOut from '@/components/SignOut'
import SwitchUser from '@/components/SwitchUser'

const Settings = () => {
  const { t } = useTranslation()

  return (
    <>
      <View className="bg-secondary-800">
        <VStack className="px-3 h-full">
          <Box className="h-1/6 p-4">
            <Heading className="text-white text-4xl ">{t('settings')}:</Heading>
          </Box>
          <VStack className="h-5/6 justify-between py-4">
            <VStack>
              <Box className="mb-4 rounded border-secondary-500 border-2 p-6 flex-row justify-between items-center">
                <SwitchLanguage />
              </Box>
              <Box className="mb-4 rounded border-secondary-500 border-2 p-6 flex-row justify-between items-center">
                <NotificationsToggle />
              </Box>
            </VStack>
            <Box className="p-6 ">
              <VStack>
                <Box className="mb-4">
                  <SwitchUser />
                </Box>
                <Box>
                  <SignOut />
                </Box>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </View>
    </>
  )
}

export default Settings
