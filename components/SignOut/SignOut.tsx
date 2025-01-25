import { Button, ButtonText, ButtonIcon } from '@/components/ui'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import { AuthTypes } from '@/api/types'
import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react-native'

const SignOut = () => {
  const { t } = useTranslation()
  const { signOut } = useSession()
  const { activeProfile: selectedProfile } = useUser()
  const role = selectedProfile?.role as AuthTypes.UserRole

  return (
    <Button className="bg-error-900 flex-row " onPress={async () => await signOut(role)}>
      <ButtonText>{t('logout')}</ButtonText>
      <ButtonIcon as={LogOut} />
    </Button>
  )
}

export default SignOut
