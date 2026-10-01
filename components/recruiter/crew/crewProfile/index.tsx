import { useState, FC } from 'react'
import { View, Text, ScrollView, Linking } from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MessageCircle, AlertCircle } from 'lucide-react-native'
import { useRecruiter } from '@/Providers/RecruiterProvider'
import { useStatusToast, useManualRefresh } from '@/hooks'
// import { getCrewCV, contactCrew, removeCrew } from '@/api'
import { getCrewCvPost, contactCrew, removeCrew } from '@/api'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook, getCoursesCount, getCrewPhotos } from '@/utils/crewUtils'
import { Loading, RefreshControl } from '@/components/ui'
import { ApiError, parseServerBool } from '@/api/utils'
import { C } from '@/components/appUI/tokens'
import { PhotoSlider } from '@/components/appUI'
import ContactCrewModal from './ContactCrewModal'
import ContactCrewInfoModal from './ContactCrewInfoModal'
import RemoveCrewModal from './RemoveCrewModal'
import CrewNavBar from './CrewNavBar'
import HeroCard from './HeroCard'
import ContactInfoSection from './ContactInfoSection'
import QuadFactsGrid from './QuadFactsGrid'
import RolesSection from './RolesSection'
import LanguagesEducationSection from './LanguagesEducationSection'
import ExperienceSection from './ExperienceSection'
import SkillsSection from './SkillsSection'
import AboutSection from './AboutSection'
import ReferencesSection from './ReferencesSection'
import ActionBar from './ActionBar'

const CrewProfile: FC<{ isModal?: boolean }> = ({ isModal }) => {
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [contactInfoVisible, setContactInfoVisible] = useState(false)
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [photoSliderVisible, setPhotoSliderVisible] = useState(false)
  const [photoSliderIndex, setPhotoSliderIndex] = useState(0)
  const {
    i18n: { language },
    t,
  } = useTranslation(['crew-screen', 'crew', 'screens-labels', 'common', 'offer', 'search-screen'])

  const { crewId, searchId } = useLocalSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { token } = useRecruiter()
  const { showToast } = useStatusToast()

  const { isLoading, isSuccess, isError, refetch, data, error } = useQuery({
    queryKey: ['recruiter-crew-cv', searchId, crewId, language],
    // queryFn: () => getCrewCV(token, crewId as string),
    queryFn: () => {
      return getCrewCvPost(crewId as string, searchId as string, token, language)
    },
  })
  const crew = isSuccess ? data : null
  const { refreshing, onRefresh } = useManualRefresh(refetch)

  const { mutate: handleContactCrew, isPending } = useMutation({
    mutationFn: () => contactCrew(token, crewId as string, searchId as string, language),
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('contact-crew-success', { ns: 'crew-screen' }),
        duration: 8000,
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError && error.title !== 'unknown-error' ? error.title : null
      showToast({
        emphasize: 'error',
        title: 'Error',
        description: message ?? t('contact-crew-error', { ns: 'crew-screen' }),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] })
      queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list-post', searchId] })
      setContactModalVisible(false)
    },
  })

  const { mutate: handleRemoveCrew, isPending: isPendingRemove } = useMutation({
    mutationFn: () => removeCrew(token, crewId as string, searchId as string, language),
    onSuccess: async () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('remove-crew-success', { ns: 'crew-screen' }),
        duration: 8000,
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['recruiter-crew-cv', searchId, crewId] }),
        queryClient.invalidateQueries({ queryKey: ['recruiter-crew-list-post', searchId] }),
      ])
      setRemoveModalVisible(false)
      router.back()
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError && error.title !== 'unknown-error' ? error.title : null
      showToast({
        emphasize: 'error',
        title: 'Error',
        description: message ?? t('remove-crew-error', { ns: 'crew-screen' }),
      })
    },
  })

  const isActionLoading = isPending || isPendingRemove

  const handleOpenContact = (url: string) => {
    // Note: Linking.canOpenURL() unreliably returns false for mailto:/tel: on iOS unless the
    // scheme is declared in LSApplicationQueriesSchemes, so we call openURL directly and just
    // swallow the rejection it throws when there's genuinely no app to handle it.
    Linking.openURL(url).catch(() => {})
  }

  const handleRemovePress = () => setRemoveModalVisible(true)

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Loading />
      </View>
    )
  }

  if (isError) {
    const apiMessage = error instanceof ApiError ? error.title : undefined
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <CrewNavBar isModal={isModal} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
          <AlertCircle size={40} color="#EF4444" strokeWidth={1.6} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#EF4444', textAlign: 'center' }}>
            {apiMessage ?? t('unknown-error', { ns: 'common' })}
          </Text>
        </View>
      </View>
    )
  }

  if (!crew) return null

  if (!crew.iduser) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <CrewNavBar isModal={isModal} onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
          <AlertCircle size={40} color={C.ink4} strokeWidth={1.6} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, textAlign: 'center' }}>
            {t('profile-not-available', { ns: 'crew-screen' })}
          </Text>
          <Text style={{ fontSize: 14, color: C.ink3, textAlign: 'center', lineHeight: 20 }}>
            {t('profile-not-available-description', { ns: 'crew-screen' })}
          </Text>
        </View>
      </View>
    )
  }

  const isContacted = parseServerBool(crew.contacted)
  const photoUrl = crew.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const photos = getCrewPhotos(crew).map((p) => getPhotoUrl(p))
  const photoCount = photos.length
  const age = crew.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const { hasCertificateOfCompetence } = getCertificateOfCompetence(crew)
  const hasSeamansBook = getSeamansBook(crew)

  const initials = isContacted
    ? ((crew.name?.[0] ?? '') + (crew.surname?.[0] ?? '')).toUpperCase() || '?'
    : (crew.mainPosition?.[0] ?? '?').toUpperCase()

  const otherPositions = [
    crew.pos_deck && `Deck: ${crew.pos_deck}`,
    crew.pos_engine && `Engine: ${crew.pos_engine}`,
    crew.pos_harbour && `Harbour: ${crew.pos_harbour}`,
    crew.pos_hotel && `Hotel: ${crew.pos_hotel}`,
    crew.pos_special && `Special: ${crew.pos_special}`,
  ].filter(Boolean) as string[]

  const languages = [crew.language1, crew.language2, crew.language3, crew.language4].filter(Boolean) as string[]

  const coursesList = crew.courses
    ? crew.courses
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
    : []

  // The backend sometimes returns a full wa.me URL here instead of a bare number — strip it for display.
  const waNumber = crew.callWhatsapp?.replace(/^https?:\/\/wa\.me\//i, '') ?? ''

  const contactEntries = [
    {
      icon: Mail,
      label: t('email', { ns: 'crew' }),
      value: crew.email || crew.emailCc,
      href: (v: string) => `mailto:${v}`,
    },
    {
      icon: Phone,
      label: t('cellular', { ns: 'crew' }),
      value: crew.cellular,
      href: (v: string) => `tel:${v.replace(/\s/g, '')}`,
    },
    {
      icon: MessageCircle,
      label: t('whatsapp', { ns: 'crew' }),
      value: waNumber,
      href: (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`,
    },
  ].filter((entry): entry is typeof entry & { value: string } => !!entry.value)

  const contactModalEntries = contactEntries.map((entry) => ({
    icon: entry.icon,
    label: entry.label,
    value: entry.value,
    onPress: () => handleOpenContact(entry.href(entry.value)),
  }))

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Nav bar */}
      <CrewNavBar isModal={isModal} onBack={() => router.back()} title={`CV #${crew.iduser}`} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero card */}
        <HeroCard
          photoUrl={photoUrl}
          photoCount={photoCount}
          initials={initials}
          mainPosition={crew.mainPosition}
          iduser={crew.iduser}
          isContacted={isContacted}
          name={crew.name}
          surname={crew.surname}
          passport={crew.passport}
          city={crew.city}
          age={age}
          maritalStatus={crew.maritalStatus}
          gender={crew.gender}
          onAvatarPress={() => {
            setPhotoSliderIndex(0)
            setPhotoSliderVisible(true)
          }}
          hasSeamansBook={hasSeamansBook}
          hasCertificateOfCompetence={hasCertificateOfCompetence}
          hasCourses={coursesList.length > 0}
          coursesCount={getCoursesCount(crew.courses)}
        />

        {/* Contact info — visible only when contacted */}
        {isContacted && contactEntries.length > 0 && <ContactInfoSection entries={contactModalEntries} />}

        {/* Quad facts grid */}
        <QuadFactsGrid
          dateAvailability={crew.dateAvailability}
          calculatedExperience={crew.calculatedExperience}
          salary={crew.salary}
          lastAccessDate={crew.lastAccessDate}
        />

        {/* Roles & positions */}
        <RolesSection mainPosition={crew.mainPosition} specseling={crew.specseling} otherPositions={otherPositions} />

        {/* Languages & education */}
        <LanguagesEducationSection
          languages={languages}
          educationalLevel={crew.educationalLevel}
          coursesList={coursesList}
        />

        {/* Experiences */}
        <ExperienceSection experiences={crew.experiences} />

        {/* Skills */}
        <SkillsSection
          relationalSkills={crew.relationalSkills}
          organizationalSkills={crew.organizationalSkills}
          technicalSkills={crew.technicalSkills}
          professionalSkills={crew.professionalSkills}
        />

        {/* About */}
        <AboutSection curriculum={crew.curriculum} />

        {/* References */}
        <ReferencesSection approvedReferences={crew.approvedReferences} isContacted={isContacted} />
      </ScrollView>

      {/* Bottom action bar */}
      <ActionBar
        isContacted={isContacted}
        isActionLoading={isActionLoading}
        onRemove={handleRemovePress}
        onContactPress={() => (isContacted ? setContactInfoVisible(true) : setContactModalVisible(true))}
      />

      <ContactCrewModal
        visible={contactModalVisible}
        crew={crew}
        onClose={() => setContactModalVisible(false)}
        onConfirm={handleContactCrew}
        isSubmitting={isPending}
      />
      <ContactCrewInfoModal
        visible={contactInfoVisible}
        onClose={() => setContactInfoVisible(false)}
        name={isContacted ? `${crew.name ?? ''} ${crew.surname ?? ''}`.trim() : undefined}
        entries={contactModalEntries}
      />
      <RemoveCrewModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onConfirm={handleRemoveCrew}
        isSubmitting={isPendingRemove}
      />
      <PhotoSlider
        visible={photoSliderVisible}
        photos={photos}
        initialIndex={photoSliderIndex}
        onClose={() => setPhotoSliderVisible(false)}
      />
    </View>
  )
}

export default CrewProfile

CrewProfile.displayName = 'CrewProfile'
