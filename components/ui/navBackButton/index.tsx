import { FC } from 'react'
import { Button, ButtonText } from '../button'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'

const NavBackButton: FC<{ href: string }> = ({ href }) => {
  return (
    <Button className="ml-1" variant="link" onPress={() => router.replace(href)}>
      <Feather name="chevron-left" size={26} color={'rgb(234 88 12)'} className="ont-thick" />
      <ButtonText className="text-xl -ml-2">Back</ButtonText>
    </Button>
  )
}

export { NavBackButton }
