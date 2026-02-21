import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import { Users, MapPin, Briefcase, Search, UserCheck } from 'lucide-react-native'
import { TRecruiterSearch } from '@/api/types'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'
import { Box, VStack, HStack, Heading, Text, Button, ButtonText, ButtonIcon, Badge, BadgeText } from '@/components/ui'
import { SubSection, SubSectionHeader } from '@/components/appUI'

interface ISearchListItemProps {
  search: TRecruiterSearch
}

const SearchListItem: FC<ISearchListItemProps> = ({ search }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['searches-screen'])
  const { activeProfile } = useUser()
  const { token } = activeProfile as ActiveProfile

  const viewSearch = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}`)
  const viewCrewList = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list`)

  // const handleEditSearch = () => {
  //   const url = `https://www.marineria.it/${language}/Rec/Post.aspx?idofferta=${search.idoffer}&token=${token}`
  //   Linking.openURL(url)
  // }

  const openSearchByLocation = () => {
    const url = `https://www.marineria.it/${language}/${search.listgeourl}?token=${token}`
    Linking.openURL(url)
  }

  const openSearchBySkill = () => {
    const url = `https://www.marineria.it/${language}/${search.listurl}?token=${token}`
    Linking.openURL(url)
  }

  const referenceShort = search.reference.includes('_') ? search.reference.split('_')[1] : search.reference

  return (
    <Box className="bg-white p-3 rounded-md">
      <VStack space="xs">
        <Heading size="lg" className="text-primary-600 leading-tight">
          {search.title.trim() || '—'}
        </Heading>
        <HStack className="justify-between items-center border-b border-background-200 pb-2 mb-1">
          <Text size="xs" shade={400}>
            [Ref: {referenceShort}]
          </Text>
          <Text shade={400} size="xs">
            {search.offerdate}
          </Text>
        </HStack>
        <SubSection title={t('offer')} icon={Briefcase} onPress={viewSearch}>
          <Text size="sm" semiBold shade={800}>
            {search.offer.trim() || '—'}
          </Text>
        </SubSection>
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
    </Box>
  )
}

export default SearchListItem
