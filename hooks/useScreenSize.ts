import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const useScreenSize = () => ({
  isSmall: width < 390, // iPhone SE, mini, and standard
  isMedium: width >= 390 && width < 428, // Pro, Plus
  isLarge: width >= 428, // Pro Max
  width,
})
