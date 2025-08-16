import { FC } from 'react'
import { Button, ButtonGroup, ButtonText } from '../button'

export enum ToggleVariants {
  Default = 'primary',
  Secondary = 'secondary',
  Active = 'positive',
  InActive = 'negative',
}

interface ToggleButtonsInterface {
  value?: boolean
  onLabel: string
  offLabel: string
  onColor?: ToggleVariants
  offColor?: ToggleVariants
  onChange: () => void | Promise<any>
  fullWidth?: boolean
}

const ToggleButtons: FC<ToggleButtonsInterface> = ({
  value,
  onLabel,
  offLabel,
  onChange,
  onColor = ToggleVariants.Active,
  offColor = ToggleVariants.InActive,
  fullWidth = false,
}) => {
  return (
    <ButtonGroup isAttached className={fullWidth ? 'w-full' : ''}>
      <Button
        className={`rounded-tr-none rounded-br-none ${fullWidth ? 'w-1/2' : ''}`}
        action={value ? onColor : offColor}
        onPress={!value ? () => onChange() : () => null}
        isDisabled={value}
      >
        <ButtonText>{onLabel}</ButtonText>
      </Button>
      <Button
        className={`rounded-tl-none rounded-bl-none ${fullWidth ? 'w-1/2' : ''}`}
        action={!value ? onColor : offColor}
        onPress={value ? () => onChange() : () => null}
        isDisabled={!value}
      >
        <ButtonText>{offLabel}</ButtonText>
      </Button>
    </ButtonGroup>
  )
}

export { ToggleButtons }
