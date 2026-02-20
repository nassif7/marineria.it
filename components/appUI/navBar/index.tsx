import { FC } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { useRouter, usePathname } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Box, Heading, HStack, Pressable, Icon } from '@/components/ui'
import { ChevronLeft } from 'lucide-react-native'
import type { NativeStackHeaderProps } from '@react-navigation/native-stack'

interface NavBarProps extends NativeStackHeaderProps {
  rightAction?: React.ReactNode
}

export const NavBar: FC<NavBarProps> = ({ options, back, rightAction }) => {
  const title = options?.title || ''
  const canGoBack = back !== undefined
  const router = useRouter()

  return (
    <Box className="px-1 py-2 border-b border-outline-100">
      <HStack className="items-center justify-between min-h-[40px] ">
        {canGoBack ? (
          <Pressable onPress={() => router.back()} className="flex-row items-center  -ml-2">
            <Icon as={ChevronLeft} size="3xl" className="text-typography-400" />
            <Text className="text-typography-500 text-lg font-medium">{back.title}</Text>
          </Pressable>
        ) : (
          <Box className="w-20" />
        )}

        {title && (
          <Heading size="md" className="absolute left-0 right-0 text-center font-bold" style={{ zIndex: -1 }}>
            {title}
          </Heading>
        )}
        {rightAction ? <Box>{rightAction}</Box> : <Box className="w-20" />}
      </HStack>
    </Box>
  )
}
