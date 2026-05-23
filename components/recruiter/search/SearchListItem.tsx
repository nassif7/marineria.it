import { FC } from 'react'
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TRecruiterSearch } from '@/api/types'
import { C } from '@/components/pro/tokens'

interface ISearchListItemProps {
  search: TRecruiterSearch
}

const SearchListItem: FC<ISearchListItemProps> = ({ search }) => {
  const { t } = useTranslation(['search-screen', 'offer'])
  const viewSearch = () => router.push(`/(tabs)/recruiter/search/${search.idoffer}`)
  const viewCrewList = (filter: 'all' | 'selected' | 'contacted') =>
    router.push(`/(tabs)/recruiter/search/${search.idoffer}/crew/list?filter=${filter}`)

  const referenceShort = search.reference.includes('_') ? search.reference.split('_')[1] : search.reference

  const salary =
    search.salary_From && search.salary_To
      ? search.salary_From === search.salary_To
        ? search.salary_From
        : `${search.salary_From} – ${search.salary_To}`
      : null

  const facts = [
    salary ? [t('salary', { ns: 'offer' }), salary] : null,
    search.boarding ? [t('boarding', { ns: 'offer' }), search.boarding.trim()] : null,
    search.contractDescription ? [t('contract-type', { ns: 'offer' }), search.contractDescription] : null,
  ].filter(Boolean) as [string, string][]

  return (
    <Pressable style={si.card} onPress={viewSearch}>
      {/* Top row: vessel chip + status */}
      <View style={si.topRow}>
        {search.jobOffer ? (
          <View style={si.positionChip}>
            <Text style={si.positionChipText}>{search.jobOffer}</Text>
          </View>
        ) : (
          <View />
        )}
        <View style={si.statusPill}>
          <View style={si.statusDot} />
          <Text style={si.statusPillText}>{t('status-active')}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={si.title} numberOfLines={2}>
        {search.title?.trim() || '—'}
      </Text>

      {/* Facts grid */}
      {facts.length > 0 && (
        <View style={si.factsGrid}>
          {facts.map(([label, value], i) => (
            <View key={label} style={i === 2 ? si.factFull : si.factHalf}>
              <Text style={si.factLabel}>{label}</Text>
              <Text style={si.factValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Candidates funnel */}
      <Text style={si.funnelSectionLabel}>{t('candidates-overview')}</Text>
      <View style={si.funnel}>
        {(() => {
          const selected = Math.max(0, search.countCandidates - search.countResidual - search.countContacted)
          const contacted = search.countContacted
          return (
            <>
              <FunnelStage
                n={search.countCandidates}
                label={t('filter-all')}
                color={C.ink}
                labelColor={C.ink3}
                onPress={() => viewCrewList('all')}
              />
              <FunnelArrow />
              <FunnelStage
                n={selected}
                label={t('selected')}
                color={selected > 0 ? C.orangeText : C.ink4}
                labelColor={selected > 0 ? C.orangeText : C.ink4}
                onPress={() => viewCrewList('selected')}
              />
              <FunnelArrow />
              <FunnelStage
                n={contacted}
                label={t('contacted')}
                color={contacted > 0 ? C.green : C.ink4}
                labelColor={contacted > 0 ? C.green : C.ink4}
                onPress={() => viewCrewList('contacted')}
              />
            </>
          )
        })()}
      </View>

      {/* Footer */}
      <View style={si.footer}>
        <Text style={si.footerRef}>Ref · {referenceShort}</Text>
        <View style={si.manageRow}>
          <Text style={si.manageText}>{t('view-search')}</Text>
          <ChevronRight size={14} color={C.green} strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  )
}

function FunnelStage({
  n,
  label,
  color,
  labelColor,
  onPress,
}: {
  n: number
  label: string
  color: string
  labelColor: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={si.funnelStage} onPress={onPress} activeOpacity={0.7}>
      <Text style={[si.funnelNum, { color }]}>{Math.max(0, n)}</Text>
      <Text style={[si.funnelLabel, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  )
}

function FunnelArrow() {
  return (
    <View style={{ opacity: 0.35, flexShrink: 0 }}>
      <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
    </View>
  )
}

const si = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  positionChip: {
    backgroundColor: C.ink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  positionChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F8EB',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F7A28',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
    lineHeight: 22,
    marginBottom: 12,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 16,
    marginBottom: 14,
  },
  factHalf: {
    width: '45%',
  },
  factFull: {
    width: '100%',
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  factValue: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
  },
  funnelSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.ink4,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  funnel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: C.field,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  funnelStage: {
    flex: 1,
    alignItems: 'center',
  },
  funnelNum: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  funnelLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  footerRef: {
    fontSize: 12,
    color: C.ink4,
  },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  manageText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.green,
  },
})

export default SearchListItem
