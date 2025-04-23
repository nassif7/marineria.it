import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

// #TODO add breadcrumbs to the nav bar
interface NavBarProps {
  title?: string
  showBackButton?: boolean
}

export const NavBar: React.FC<NavBarProps> = ({ title, showBackButton }) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <View className="flex-row items-center justify-start bg-secondary-800  pl-2 h-20">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} className="flex flex-row items-center mr-2">
          <Feather name="chevron-left" size={32} color="white" />
          <Text className="text-white text-xl">{t('back')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
