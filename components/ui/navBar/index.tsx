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
    <View className="flex-row items-center justify-start bg-white py-2 border rounded-lg border-secondary-50">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} className="flex flex-row items-center mr-2">
          <Feather name="chevron-left" size={32} className="text-secondary-600" />
          <Text className="text-secondary-600 text-xl">{t('back')}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
