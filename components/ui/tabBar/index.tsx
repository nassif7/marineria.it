import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const TabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgb(30 41 59)',
        boxShadow: '0px 0px 20px 0px rgba(234,88,12,0.25)',
        paddingBottom: insets.bottom + 10,
        paddingTop: 10,
      }}
      className="px-3"
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel || options.title || route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const Icon = options.tabBarIcon

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ alignItems: 'center', opacity: isFocused ? 1 : 0.6 }}
          >
            {Icon && Icon({ color: isFocused ? 'rgb(234 88 12)' : 'white' })}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
