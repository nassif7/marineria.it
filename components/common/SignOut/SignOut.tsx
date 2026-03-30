import { FC } from 'react'
import { LogOut } from 'lucide-react-native'
import { Button, ButtonText, ButtonIcon } from '@/lib/components/ui'

interface ISignOutProps {
  buttonLabel: string
  handleLogout: () => void
}
const SignOut: FC<ISignOutProps> = ({ buttonLabel = 'Logout', handleLogout }) => {
  return (
    <Button className="bg-error-900 flex-row " onPress={handleLogout}>
      <ButtonText>{buttonLabel}</ButtonText>
      <ButtonIcon as={LogOut} />
    </Button>
  )
}

export default SignOut
