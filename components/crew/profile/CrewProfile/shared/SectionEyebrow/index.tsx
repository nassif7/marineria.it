import { FC } from 'react'
import { Text } from 'react-native'
import { styles } from './styles'

const SectionEyebrow: FC<{ label: string }> = ({ label }) => <Text style={styles.eyebrow}>{label}</Text>

export default SectionEyebrow
