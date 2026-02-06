import React from 'react'
import { View, Text } from 'react-native'
import { CrewList } from '@/components/recruiter/Crew'
import { useLocalSearchParams, useRouter } from 'expo-router'

const Crew = () => {
  return <CrewList />
}

export default Crew
