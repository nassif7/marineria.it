import { ScreenContainer, SubSection } from '@/components/appUI'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCrewCV } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { VStack, Text } from '@/components/ui'
import { Loading } from '@/components/ui/loading'
import { useTranslation } from 'react-i18next'

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

  const crew = isSuccess ? data?.[0] : null

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
        <Text color="error">{t('error')}</Text>
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer scroll refreshing={isRefetching} onRefresh={refetch}>
      {isSuccess && crew && (
        <VStack space="xs" className="pb-10">
          <ProfileHeader crew={crew} />
          <CrewAvailability crew={crew} />
          <CrewPreferences crew={crew} />
          <ProfileContact crew={crew} />
          <CrewReferences crew={crew} />
          <PositionsSection crew={crew} />
          <LanguagesSection crew={crew} />
          <CrewCourses crew={crew} />
          <CrewExperiences crew={crew} />
          <CrewSkills crew={crew} />
          <AboutSection crew={crew} />
        </VStack>
      )}
    </ScreenContainer>
  )
}

export default CrewProfile

{
  /* <ProfileHeader crew={crew} /> */
}
{
  /* <ContactSection crew={crew} /> */
}
{
  /* <AvailabilitySection crew={crew} /> */
}
{
  /* <ExperiencesSection crew={crew} /> */
}
{
  /* <CoursesSection crew={crew} /> */
}
{
  /* <PositionsSection crew={crew} /> */
}
{
  /* <LanguagesSection crew={crew} /> */
}
{
  /* <PreferencesSection crew={crew} /> */
}
{
  /* <ReferencesSection crew={crew} /> */
}
{
  /* <AboutSection crew={crew} /> */
}
{
  /* <Button size="lg" action="positive" variant="solid" className="mt-1">
        <ButtonText>Contact Crew</ButtonText>
      </Button> */
}
