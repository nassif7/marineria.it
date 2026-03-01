import { FC } from 'react'
import { ButtonText, Button } from '@/components/ui'

interface ISwitchUserProps {
  label: string
  handleSwitch: () => void
}

const SwitchUser: FC<ISwitchUserProps> = ({ label, handleSwitch }) => {
  return (
    <Button onPress={handleSwitch}>
      <ButtonText className="text-white ">{label}</ButtonText>
    </Button>
  )
}

export default SwitchUser
