import { router } from 'expo-router'

import { ButtonText, Button, View } from '@/components/ui'
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
  const proToken = storedAuthTokens[AuthTypes.UserRole.CREW]
  const ownerToken = storedAuthTokens[AuthTypes.UserRole.RECRUITER]
  const { user, activeProfile, switchProfile } = useUser()
  const hasBothTokens = proToken && ownerToken

  const targetRole = role == AuthTypes.UserRole.CREW ? AuthTypes.UserRole.RECRUITER : AuthTypes.UserRole.CREW

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
      {role == AuthTypes.UserRole.RECRUITER && (
        <Button onPress={handleSwitch}>
          <ButtonText className="text-white ">{t('switchToPro')}</ButtonText>
        </Button>
      )}
      {role == AuthTypes.UserRole.CREW && (
        <Button onPress={handleSwitch}>
          <ButtonText className="text-white ">{t('switchToOwner')}</ButtonText>
        </Button>
      )}
    </View>
  )
}

export default SwitchUser
