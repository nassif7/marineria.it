import { FC } from 'react'
import { Button, ButtonIcon, ButtonText } from '../button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Lamp, Plus, Share2Icon, Subscript, MapPin, Calendar, ChevronLeft } from 'lucide-react-native'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'

const NavBackButton: FC<{ href: string }> = ({ href }) => {
  return (
    <Button className="ml-2" variant="link" onPress={() => router.replace(href)}>
      <Feather name="chevron-left" size={22} color={'rgb(234 88 12)'} className="ont-thin" />
      <ButtonText className="text-xl font-thin">Back</ButtonText>
    </Button>
  )
}

export { NavBackButton }
