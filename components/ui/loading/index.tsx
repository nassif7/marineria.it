import { FC } from 'react'
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'
import { Spinner } from '../spinner'
import { Box } from '../box'

const Loading: FC = () => {
  return (
    <BlurView intensity={50} tint="extraLight" style={styles.container}>
      <Box className="bg-white/50 rounded-2xl p-8 shadow-2xl">
        <Spinner size="large" className="text-primary-600" />
      </Box>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
})

export { Loading }
