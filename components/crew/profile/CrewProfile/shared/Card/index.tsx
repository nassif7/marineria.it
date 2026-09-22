import { FC, ReactNode } from 'react'
import { View } from 'react-native'
import { styles } from './styles'

const Card: FC<{ children: ReactNode }> = ({ children }) => <View style={styles.rowCard}>{children}</View>

export default Card
