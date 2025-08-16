import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, View, VStack, Heading } from '@/components/ui-lib'
import SwitchLanguage from '@/components/common/SwitchLanguage'
import NotificationsToggle from '@/components/common/NotificationsToggle'
import SignOut from '@/components/common/SignOut'
import SwitchUser from '@/components/common/SwitchUser'

const Settings = () => {
  const { t } = useTranslation()

  return (
    <View className="bg-secondary-800">
      <VStack className="px-3 h-full">
        <Box className="p-4">
          <Heading size="2xl" className="text-white">
            {t('settings')}:
          </Heading>
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
  )
}

export default Settings
