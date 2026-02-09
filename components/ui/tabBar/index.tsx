import React from 'react'
import { Platform } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Box, HStack, VStack, Text, Pressable, Icon } from '@/components/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface TabBarProps extends BottomTabBarProps {
  showLabel?: boolean
}

export const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, showLabel }) => {
  const insets = useSafeAreaInsets()

  return (
    <Box
      className="bg-secondary-900"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
      }}
    >
      <HStack className="justify-around items-center">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const label = options.title ?? route.name

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center py-3"
            >
              <VStack className="items-center gap-1">
                {/* Tab Icon */}
                {options.tabBarIcon && (
                  <Icon
                    as={options.tabBarIcon}
                    size={isFocused ? '3xl' : '2xl'}
                    className={isFocused ? 'text-primary-600' : 'text-secondary-300'}
                  />
                )}

                {showLabel && (
                  <Text
                    className={isFocused ? 'text-primary-600 text-xs font-semibold' : 'text-secondary-300 text-xs'}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                )}
              </VStack>
            </Pressable>
          )
        })}
      </HStack>
    </Box>
  )
}
