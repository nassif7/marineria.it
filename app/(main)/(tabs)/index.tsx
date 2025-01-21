// import { View, ImageBackground } from 'react-native'
import { useTranslation } from 'react-i18next'
import UserProfile from '@/components/UserProfile'
import { View } from '@/components/ui'
const Home = () => {
  const { t } = useTranslation()

  return (
    <View className="flex justify-center align-middle h-full items-center bg-secondary-800 px-4">
      <UserProfile />
    </View>
  )
}

export default Home
