import { FC } from 'react'
import { View } from 'react-native'
import { Users } from 'lucide-react-native'
import { C } from '@/components/appUI/tokens'
import { styles } from './styles'

const AvatarPlaceholder: FC<{ size: number; radius: number }> = ({ size, radius }) => (
  <View style={[styles.avatarPlaceholder, { width: size, height: size, borderRadius: radius }]}>
    <Users size={size * 0.42} color={C.orange} strokeWidth={1.6} />
  </View>
)

export default AvatarPlaceholder
