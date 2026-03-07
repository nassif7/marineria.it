import { useState } from 'react'
import { ScreenContainer } from '@/components/appUI'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCrewCV } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { VStack, Text } from '@/components/ui'
import { Loading } from '@/components/ui/loading'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@/components/appUI'

import ProfileHeader from './ProfileHeader'
import ProfileContact from './CrewContact'
import CrewAvailability from './CrewAvailability'
import CrewExperiences from './CrewExperiences'
import CrewCourses from './CrewCoursesAndCertifications'
import CrewReferences from './CrewReferences'
import AboutSection from './AboutSection'
import CrewPreferences from './CrewPreferences'
import LanguagesSection from './CrewLanguagesAndEducation'
import PositionsSection from './CrewPosition'
import CrewSkills from './CrewSkills'
import ProfileActionButtons from './ProfileActionButtons'
import ContactCrewModal from './ContactCrewModal'

import Reanimated from 'react-native-reanimated'

const CrewProfile = () => {
  const { t } = useTranslation(['crew-screen'])
  const { crewid, searchId } = useLocalSearchParams()

  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile
  const queryClient = useQueryClient()

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId],
    queryFn: () => getCrewCV(token, crewid as string),
  })

  const crew = isSuccess ? data : null

  const [actionsVisible, setActionsVisible] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)

  const handleConfirmContact = (requestPdf: boolean) => {
    setContactModalVisible(false)
    // TODO: call your API here with requestPdf flag
  }

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y
    if (y > 60 && !actionsVisible) setActionsVisible(true)
    else if (y <= 60 && actionsVisible) setActionsVisible(false)
  }

  const AnimatedView = Reanimated.View

  if (isLoading || isRefetching) {
    return (
      <ScreenContainer>
        <Loading />
      </ScreenContainer>
    )
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorMessage />
      </ScreenContainer>
    )
  }

  return (
    <>
      <ScreenContainer
        className="flex-1 bg-background-100"
        scroll
        handleScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 140 }}
        onRefresh={refetch}
      >
        {isSuccess && crew && (
          <VStack space="xs">
            <ProfileHeader crew={crew} />
            <CrewAvailability crew={crew} />
            <CrewPreferences crew={crew} />
            {crew.contacted && <ProfileContact crew={crew} />}
            <CrewReferences crew={crew} />
            <PositionsSection crew={crew} />
            <LanguagesSection crew={crew} />
            <CrewCourses crew={crew} />
            <CrewExperiences crew={crew} />
            <CrewSkills crew={crew} />
            <AboutSection crew={crew} />
            <ContactCrewModal
              visible={contactModalVisible}
              crew={crew}
              onClose={() => setContactModalVisible(false)}
              onConfirm={handleConfirmContact}
            />
          </VStack>
        )}
      </ScreenContainer>

      {actionsVisible && (
        <ProfileActionButtons onGetContact={() => setContactModalVisible(true)} onRemove={console.log} />
      )}
    </>
  )
}

export default CrewProfile

CrewProfile.displayName = 'CrewProfile'
