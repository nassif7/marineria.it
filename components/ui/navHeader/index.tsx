import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export const NavHeader: React.FC<any> = ({ title, onBack }) => {
  return (
    <View
      style={{
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
      }}
    >
      <TouchableOpacity onPress={() => onBack()} style={{ padding: 8 }}>
        <Text style={{ fontSize: 18 }}>back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  )
}
