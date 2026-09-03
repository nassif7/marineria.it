import { FC, ReactNode } from 'react'
import { View, Text } from 'react-native'
import { styles } from './styles'

const SectionCard: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
)

export default SectionCard
