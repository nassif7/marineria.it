import { useState } from 'react'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ScreenContainer } from '@/components/appUI'
import { getCrewCV, contactCrew, removeCrew } from '@/api'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { VStack, Loading } from '@/components/ui'
import { ErrorMessage } from '@/components/appUI'
import { useStatusToast } from '@/hooks'

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

const CrewProfile = () => {
  const [actionsVisible, setActionsVisible] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const { crewId, searchId } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const { activeProfile } = useUser()
  const { showToast } = useStatusToast()

  const { token } = activeProfile as ActiveProfile

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y
    if (y > 60 && !actionsVisible) setActionsVisible(true)
    else if (y <= 60 && actionsVisible) setActionsVisible(false)
  }

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId, crewId],
    queryFn: () => getCrewCV(token, crewId as string),
  })
  const crew = isSuccess ? data : null

  const { mutate: handleContactCrew, isPending } = useMutation({
    mutationFn: () => {
      return contactCrew(token, crewId as string, searchId as string, language)
    },
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('contact-crew-success', { ns: 'crew-screen' }),
      })
    },
    onError: (message) => {
      showToast({ emphasize: 'error', title: 'Error', description: t('contact-crew-error', { ns: 'crew-screen' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['recruiter-crew-cv', searchId, crewId],
      })
      queryClient.invalidateQueries({
        queryKey: ['recruiter-crew-list', searchId],
      })
      setContactModalVisible(false)
    },
  })

  const { mutate: handleRemoveCrew, isPending: isPendingRemove } = useMutation({
    mutationFn: () => {
      return removeCrew(token, crewId as string, searchId as string, language)
    },
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('remove-crew-success', { ns: 'crew-screen' }),
      })
    },
    onError: () => {
      showToast({ emphasize: 'error', title: 'Error', description: t('remove-crew-error', { ns: 'crew-screen' }) })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['recruiter-crew-cv', searchId, crewId],
      })
      queryClient.invalidateQueries({
        queryKey: ['recruiter-crew-list', searchId],
      })
      router.back()
    },
  })

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
              onConfirm={handleContactCrew}
            />
          </VStack>
        )}
      </ScreenContainer>

      {actionsVisible && (
        <ProfileActionButtons
          onGetContact={() => setContactModalVisible(true)}
          onRemove={handleRemoveCrew}
          isLoading={isPending || isPendingRemove}
        />
      )}
    </>
  )
}

export default CrewProfile

CrewProfile.displayName = 'CrewProfile'
