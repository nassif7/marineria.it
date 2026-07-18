import { FC, useMemo } from 'react'
import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Calendar, Briefcase, ChevronRight, Check, AlertTriangle } from 'lucide-react-native'
import { TCrewSimple } from '@/api/types'
import { useTranslation } from 'react-i18next'
import { getPhotoUrl } from '@/api/consts'
import { getAgeByYear } from '@/utils/dateUtils'
import { getCertificateOfCompetence, getSeamansBook } from '@/utils/crewUtils'
import { C } from '@/components/pro/tokens'

interface ICrewListItem {
  crew: TCrewSimple
}

const GREEN_SOFT = '#E8F8EB'
const GREEN_TEXT = '#0F7A28'
const WARN_BG = '#FFF7ED'
const WARN_TEXT = '#C2600A'
const WARN_BORDER = '#FDDCB5'

const CrewListItem: FC<ICrewListItem> = ({ crew }) => {
  const { t } = useTranslation(['crew-screen', 'crew', 'search-screen'])
  const router = useRouter()
  const { searchId } = useLocalSearchParams()

  const photoUrl = useMemo(() => (crew?.userPhoto ? getPhotoUrl(crew.userPhoto) : null), [crew])
  const hasSeamansBook = getSeamansBook(crew)
  const { hasCertificateOfCompetence } = getCertificateOfCompetence(crew)
  const age = crew.birthYear ? getAgeByYear(crew.birthYear) : null
  const isContacted = !!crew.contacted

  const handlePress = () => router.push(`/recruiter/search/${searchId}/crew/${crew.userId}`)

  const initials = (crew.firstName?.[0] ?? '') + (crew.lastName?.[0] ?? '') || (crew.mainPosition?.[0] ?? '?')

  return (
    <Pressable style={ci.card} onPress={handlePress}>
      {/* ── Top row: avatar + role + id ── */}
      <View style={ci.topRow}>
        <View style={ci.avatar}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={ci.avatarImg} />
          ) : (
            <Text style={ci.avatarInitials}>{initials.toUpperCase()}</Text>
          )}
        </View>

        <View style={ci.topMeta}>
          <View style={ci.roleRow}>
            <Text style={ci.roleText} numberOfLines={1}>
              {crew.mainPosition || '—'}
            </Text>
          </View>
          {isContacted && (crew.firstName || crew.lastName) && (
            <Text style={ci.nameText} numberOfLines={1}>
              {[crew.firstName, crew.lastName].filter(Boolean).join(' ')}
            </Text>
          )}
          <View style={ci.infoRow}>
            <Text style={ci.infoText}>
              {[crew.passport, age ? `${age} ${t('years', { ns: 'crew' })}` : null, crew.gender]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Status pills ── */}
      <View style={ci.pillsRow}>
        {hasSeamansBook ? (
          <View style={[ci.pill, ci.pillGreen]}>
            <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
            <Text style={[ci.pillText, { color: GREEN_TEXT }]}>{t('seaman-book')}</Text>
          </View>
        ) : null}

        {hasCertificateOfCompetence ? (
          <View style={[ci.pill, ci.pillGreen]}>
            <Check size={10} color={GREEN_TEXT} strokeWidth={2.8} />
            <Text style={[ci.pillText, { color: GREEN_TEXT }]}>{t('coc-valid')}</Text>
          </View>
        ) : (
          <View style={[ci.pill, ci.pillWarn]}>
            <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
            <Text style={[ci.pillText, { color: WARN_TEXT }]}>{t('no-coc')}</Text>
          </View>
        )}

        {crew.courses ? (
          <View style={[ci.pill, ci.pillNeutral]}>
            <Text style={[ci.pillText, { color: C.ink2 }]}>
              {t('courses-count', { count: crew.courses.split(',').length })}
            </Text>
          </View>
        ) : (
          <View style={[ci.pill, ci.pillWarn]}>
            <AlertTriangle size={10} color={WARN_TEXT} strokeWidth={2.4} />
            <Text style={[ci.pillText, { color: WARN_TEXT }]}>{t('no-courses-short')}</Text>
          </View>
        )}
      </View>

      {/* ── Body: availability + experience ── */}
      {crew.dateAvailability || crew.calculatedExperience ? (
        <View style={ci.bodyRow}>
          {crew.dateAvailability ? (
            <View style={ci.bodyFact}>
              <Text style={ci.bodyFactLabel}>{t('available-from', { ns: 'crew' })}</Text>
              <Text style={ci.bodyFactValue}>{crew.dateAvailability}</Text>
            </View>
          ) : null}
          {crew.calculatedExperience ? (
            <View style={ci.bodyFact}>
              <Text style={ci.bodyFactLabel}>{t('experience', { ns: 'crew' })}</Text>
              <Text style={ci.bodyFactValue}>{crew.calculatedExperience}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* ── Footer: id + profile link ── */}
      <View style={ci.footer}>
        <Text style={ci.idFooterText}>#{crew.userId}</Text>
        <View style={ci.profileLink}>
          <Text style={ci.profileLinkText}>{t('view-profile')}</Text>
          <ChevronRight size={14} color={C.green} strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  )
}

const ci = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: C.ink3,
    letterSpacing: -0.5,
  },
  topMeta: {
    flex: 1,
    minWidth: 0,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  roleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: C.orangeText,
    letterSpacing: -0.2,
  },
  idText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.ink4,
    fontVariant: ['tabular-nums'],
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: C.ink2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillGreen: {
    backgroundColor: GREEN_SOFT,
    borderColor: 'transparent',
  },
  pillWarn: {
    backgroundColor: WARN_BG,
    borderColor: WARN_BORDER,
  },
  pillNeutral: {
    backgroundColor: C.field,
    borderColor: C.hair,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bodyRow: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 10,
  },
  bodyFact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bodyFactLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.ink4,
  },
  bodyFactValue: {
    fontSize: 12,
    fontWeight: '700',
    color: C.ink,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  idFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.ink4,
    fontVariant: ['tabular-nums'],
  },
  footerLabel: {
    fontSize: 12,
    color: C.ink4,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: C.ink,
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  profileLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.green,
  },
})

export default CrewListItem
