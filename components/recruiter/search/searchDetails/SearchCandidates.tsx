import React from 'react'
import { VStack, HStack, ButtonText, Button, ButtonIcon, Badge, BadgeText } from '@/components/ui'
import { Users, Info, Search, UserCheck, MapPin } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { SectionHeader, Section, SubSection } from '@/components/appUI'
import { Linking } from 'react-native'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { router } from 'expo-router'
import { TRecruiterSearch } from '@/api/types/search'

interface SearchCandidatesProps {
  search: TRecruiterSearch
  onViewCandidates: () => void
}

const SearchCandidates: React.FC<SearchCandidatesProps> = ({ search }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const openSearchByLocation = () => {
    const url = `https://www.marineria.it/${language}/${search.listgeourl}?token=${token}`
    Linking.openURL(url)
  }

  const openSearchBySkill = () => {
    const url = `https://www.marineria.it/${language}/${search.listurl}?token=${token}`
    Linking.openURL(url)
  }

  const viewCrewList = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list`)

  return (
    <Section>
      <SectionHeader title={t('candidates-overview')} icon={Users} />
      <VStack space="xs">
        <SubSection title={t('candidates-overview')} icon={Users} onPress={viewCrewList}>
          <HStack className="items-center justify-between">
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText>
                {t('candidates')}: {search.countCandidates}
              </BadgeText>
            </Badge>
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText>
                {t('contacted')}: {search.countContacted}
              </BadgeText>
            </Badge>
            <Badge action="muted" variant="outline" className="rounded-md">
              <BadgeText>
                {t('residual')}: {search.countResidual}
              </BadgeText>
            </Badge>
          </HStack>
        </SubSection>
        <SubSection title={t('find-crew')} icon={Search}>
          <HStack space="xs">
            <Button variant="solid" action="positive" onPress={openSearchBySkill} className="rounded-md  flex-1">
              <ButtonIcon as={UserCheck} />
              <ButtonText>{t('by-skill')}</ButtonText>
            </Button>
            <Button variant="solid" action="positive" onPress={openSearchByLocation} className="rounded-md flex-1">
              <ButtonIcon as={MapPin} />
              <ButtonText>{t('by-location')}</ButtonText>
            </Button>
          </HStack>
        </SubSection>
      </VStack>
    </Section>
  )
}

export default SearchCandidates
