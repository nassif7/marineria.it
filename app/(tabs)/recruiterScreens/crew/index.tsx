import React from 'react'
import { View, Text } from 'react-native'
import { CrewList } from '@/components/recruiter/Crew'
import { useLocalSearchParams } from 'expo-router'

const Crew = () => {
  const { offerId } = useLocalSearchParams()
  return <CrewList offerId={offerId as string} />
}

export default Crew
