import { router } from 'expo-router'

import { ButtonText, Button, View } from '@/components/ui-lib'
import { AuthTypes } from '@/api/types'
import { useTranslation } from 'react-i18next'
import { useUser } from '@/Providers/UserProvider'
import { useSession } from '@/Providers/SessionProvider'

const SwitchUser = () => {
  const { t } = useTranslation()

  const {
    auth: { role },
    switchAuth,
    storedAuthTokens,
  } = useSession()
  const proToken = storedAuthTokens[AuthTypes.UserRole.PRO]
  const ownerToken = storedAuthTokens[AuthTypes.UserRole.OWNER]
  const { user, activeProfile, switchProfile } = useUser()
  const hasBothTokens = proToken && ownerToken

  const targetRole = role == AuthTypes.UserRole.PRO ? AuthTypes.UserRole.OWNER : AuthTypes.UserRole.PRO

  const handleSwitch = async () => {
    if (hasBothTokens) {
      await switchAuth(targetRole)
      router.replace('/')
    } else {
      router.navigate(`/(tabs)/settings/switchUser`)
    }
  }

  return (
    <View>
      {role == AuthTypes.UserRole.OWNER && (
        <Button onPress={handleSwitch}>
          <ButtonText className="text-white ">{t('switchToPro')}</ButtonText>
        </Button>
      )}
      {role == AuthTypes.UserRole.PRO && (
        <Button onPress={handleSwitch}>
          <ButtonText className="text-white ">{t('switchToOwner')}</ButtonText>
        </Button>
      )}
    </View>
  )
}

export default SwitchUser
