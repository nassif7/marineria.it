import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { useAuthBrowser } from '@/hooks'
import { Users, MapPin, Briefcase, Search, UserCheck, Banknote, Calendar, FileText } from 'lucide-react-native'
import { TRecruiterSearch } from '@/api/types'
import { Box, VStack, HStack, Heading, Text, Button, ButtonText, ButtonIcon, Badge, BadgeText } from '@/components/ui'
import { SubSection, InfoRow } from '@/components/appUI'

interface ISearchListItemProps {
  search: TRecruiterSearch
}

const SearchListItem: FC<ISearchListItemProps> = ({ search }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['search-screen'])
  const { openUrl } = useAuthBrowser()

  const viewSearch = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}`)
  const viewCrewList = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list`)

  const openSearchByLocation = () => openUrl(`https://www.marineria.it/${language}/${search.listgeourl}`)
  const openSearchBySkill = () => openUrl(`https://www.marineria.it/${language}/${search.listurl}`)

  const referenceShort = search.reference.includes('_') ? search.reference.split('_')[1] : search.reference

  const boardingRange =
    search.boarding && search.duration
      ? `${search.boarding.trim()} → ${search.duration.trim()}`
      : (search.boarding?.trim() ?? '—')

  return (
    <Box className="bg-white p-3 rounded-md">
      <VStack space="xs">
        <Heading size="lg" className="text-primary-600 leading-tight">
          {search.title.trim() || '—'}
        </Heading>
        <HStack className="justify-between items-center border-b border-background-200 pb-2 mb-1">
          <Text size="xs" shade={400}>
            {`[${t('search-id')}: ${referenceShort}]`}
          </Text>
          <Text shade={400} size="xs">
            {search.offerdate}
          </Text>
        </HStack>
        <SubSection>
          {search.salary_From && (
            <InfoRow
              icon={Banknote}
              label={t('salary')}
              value={
                search.salary_From === search.salary_To
                  ? search.salary_From
                  : `${search.salary_From} – ${search.salary_To}`
              }
            />
          )}
          {boardingRange && <InfoRow icon={Calendar} label={t('boarding')} value={boardingRange} />}
          {search.contractDescription && (
            <InfoRow icon={FileText} label={t('contract-type')} value={search.contractDescription} className="mb-0" />
          )}
        </SubSection>

        <SubSection icon={Briefcase} title={t('offer')} onPress={viewSearch}>
          <Text size="sm" shade={700} numberOfLines={2}>
            {search.offer.trim() || '—'}
          </Text>
        </SubSection>
        <SubSection icon={Users} title={t('candidates-overview')} onPress={viewCrewList}>
          <HStack className="items-center justify-between mt-2">
            <Badge action="success" variant="solid" className="rounded-md bg-success-600">
              <BadgeText className="text-white">
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
          <HStack space="sm">
            <Button variant="solid" action="positive" onPress={openSearchBySkill} className="rounded-md flex-1">
              <ButtonText>{t('by-skill')}</ButtonText>
            </Button>
            <Button variant="solid" action="positive" onPress={openSearchByLocation} className="rounded-md flex-1">
              <ButtonText>{t('by-location')}</ButtonText>
            </Button>
          </HStack>
        </SubSection>
      </VStack>
    </Box>
  )
}

export default SearchListItem
