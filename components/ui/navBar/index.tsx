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
    <>
      <Box className="px-0 py-2">
        <HStack className="items-center justify-between min-h-[40px] ">
          {canGoBack ? (
            <Pressable onPress={() => router.back()} className="flex-row items-center  -ml-2">
              <Icon as={ChevronLeft} size="3xl" className="text-secondary-500" />
              <Text className="text-secondary-500 text-lg font-medium">{back.title}</Text>
            </Pressable>
          ) : (
            <Box className="w-20" />
          )}

          {title && (
            <Heading
              size="md"
              className="text-primary-400 absolute left-0 right-0 text-center font-semibold"
              style={{ zIndex: -1 }}
            >
              {title}
            </Heading>
          )}
          {rightAction ? <Box>{rightAction}</Box> : <Box className="w-20" />}
        </HStack>
      </Box>
    </>
  )
}
