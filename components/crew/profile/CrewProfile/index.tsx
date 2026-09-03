import { FC, useMemo, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useCrew } from '@/Providers/CrewProvider'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook, getCoursesCount, isCrewAvailable } from '@/utils/crewUtils'
import { C } from '@/components/appUI/tokens'
import { Loading, RefreshControl } from '@/components/ui'
import { useManualRefresh } from '@/hooks'
import PublicPreviewModal from '../PublicPreviewModal'
import IdentityCard from './IdentityCard'
import NotificationsBanner from './NotificationsBanner'
import QualificationsSection from './QualificationsSection'
import ProfileActionsSection from './ProfileActionsSection'
import FooterMeta from './FooterMeta'
import { calcCompletion } from './helpers'

const CrewProfile: FC = () => {
  const { t } = useTranslation('home-screen')
  const { crew, notifications, isLoading, refetch } = useCrew()
  const { refreshing, onRefresh } = useManualRefresh(refetch)
  const [previewVisible, setPreviewVisible] = useState(false)

  const displayName =
    [crew?.name, crew?.surname].filter(Boolean).join(' ') || (crew?.iduser ? `ID · ${crew.iduser}` : '')
  const age = crew?.yearofBirth ? getAgeByYear(crew.yearofBirth) : null
  const photoUrl = crew?.userPhoto ? getPhotoUrl(crew.userPhoto) : null
  const { hasCertificateOfCompetence } = useMemo(
    () => (crew ? getCertificateOfCompetence(crew as any) : { hasCertificateOfCompetence: false }),
    [crew]
  )
  const hasSeamansBook = crew ? getSeamansBook(crew as any) : false
  const coursesCount = useMemo(() => getCoursesCount(crew?.courses), [crew?.courses])
  const languages = useMemo(
    () => [crew?.language1, crew?.language2, crew?.language3, crew?.language4].filter(Boolean),
    [crew]
  )
  const { pct, missing } = useMemo(() => (crew ? calcCompletion(crew as any) : { pct: 0, missing: 0 }), [crew])

  const isAvailable = isCrewAvailable(crew?.availability)
  const availabilityLabel = isAvailable ? t('crew-profile.available') : t('crew-profile.not-available')

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Loading />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Identity hero card */}
        <IdentityCard
          crew={crew}
          photoUrl={photoUrl}
          displayName={displayName}
          age={age}
          isAvailable={isAvailable}
          availabilityLabel={availabilityLabel}
          pct={pct}
          missing={missing}
        />

        {/* Notifications */}
        <NotificationsBanner notifications={notifications} />

        {/* Qualifications */}
        <QualificationsSection
          hasSeamansBook={hasSeamansBook}
          hasCertificateOfCompetence={hasCertificateOfCompetence}
          coursesCount={coursesCount}
          languagesCount={languages.length}
        />

        {/* Profile actions */}
        <ProfileActionsSection
          missing={missing}
          coursesCount={coursesCount}
          dateAvailability={crew?.dateAvailability}
          availabilityLabel={availabilityLabel}
          onPreviewPress={() => setPreviewVisible(true)}
        />

        {/* Footer meta */}
        <FooterMeta registrationDate={crew?.registraton_date} lastAccessDate={crew?.lastAccessDate} />
      </ScrollView>

      <PublicPreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} />
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: 16, paddingBottom: 32 },
})

export default CrewProfile
