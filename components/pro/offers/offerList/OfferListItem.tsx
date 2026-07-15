import { FC, memo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { ChevronRight, CheckCircle, AlertCircle, Send } from 'lucide-react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { TOffer } from '@/api/types'
import { C } from '@/components/pro/tokens'

const MATCH_BG = '#E8F5EE'
const MATCH_TEXT = '#1B7F4E'

function MatchChip({ matching, label }: { matching: boolean; label: string }) {
  return (
    <View style={[cs.matchChip, { backgroundColor: matching ? MATCH_BG : C.orangeSoft }]}>
      {matching ? (
        <CheckCircle size={11} color={MATCH_TEXT} strokeWidth={2.4} />
      ) : (
        <AlertCircle size={11} color={C.orangeText} strokeWidth={2.4} />
      )}
      <Text style={[cs.matchText, { color: matching ? MATCH_TEXT : C.orangeText }]}>{label}</Text>
    </View>
  )
}

function AppliedBadge({ label }: { label: string }) {
  return (
    <View style={cs.appliedChip}>
      <Send size={11} color={C.orange} strokeWidth={2.4} />
      <Text style={cs.appliedText}>{label}</Text>
    </View>
  )
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={cs.factLabel}>{label}</Text>
      <Text style={cs.factValue}>{value || '—'}</Text>
    </View>
  )
}

interface Props {
  offer: TOffer
  hideStatus?: boolean
  onViewOffer?: () => void
}

const OfferListItem: FC<Props> = ({ offer, hideStatus = false, onViewOffer }) => {
  const { t } = useTranslation(['offer-screen', 'offer'])
  const salary = [offer.salary_From, offer.salary_To].filter(Boolean).join(' – ') || '—'
  const imbarco = [offer.boarding, offer.duration].filter(Boolean).join(' · ')
  const ref = offer.reference?.split('_')[1] || offer.reference

  const handlePress = () => {
    if (onViewOffer) {
      onViewOffer()
    } else {
      router.push(`/pro/offers/${offer.idoffer}`)
    }
  }

  return (
    <Pressable style={cs.card} onPress={handlePress}>
      <View style={cs.topRow}>
        {offer.mainPosition ? (
          <View style={cs.posChip}>
            <Text style={cs.posChipText}>{offer.mainPosition}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        {!hideStatus && (
          <MatchChip
            matching={offer.offerApplicable}
            label={
              offer.offerApplicable ? t('matching', { ns: 'offer-screen' }) : t('not-matching', { ns: 'offer-screen' })
            }
          />
        )}
      </View>

      <Text style={cs.title} numberOfLines={3}>
        {offer.offer?.trim() || offer.title}
      </Text>

      <View style={cs.gridRow}>
        <View style={{ flex: 1 }}>
          <FactCell label={t('salary', { ns: 'offer' })} value={salary} />
        </View>
        <View style={{ flex: 1 }}>
          <FactCell label={t('base', { ns: 'offer' })} value={offer.positionArm} />
        </View>
      </View>
      <View style={cs.gridFull}>
        <FactCell label={t('boarding', { ns: 'offer' })} value={imbarco} />
      </View>

      <View style={cs.footer}>
        <View style={cs.footerLeft}>
          <Text style={cs.ref}>
            {t('job-reference', { ns: 'offer' })} · {ref}
          </Text>
          {offer.alreadyApplied && <AppliedBadge label={t('already-applied', { ns: 'offer-screen' })} />}
        </View>
        <View style={cs.detailsLink}>
          <Text style={cs.detailsText}>{t('details', { ns: 'offer-screen' })}</Text>
          <ChevronRight size={14} color={C.green} strokeWidth={2.4} />
        </View>
      </View>
    </Pressable>
  )
}

const cs = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 14,
    paddingLeft: 18,
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  posChip: {
    backgroundColor: C.orangeSoft,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  posChipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: C.orangeText,
  },
  appliedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 7,
    paddingRight: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
  },
  appliedText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.orangeText,
  },
  matchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 7,
    paddingRight: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    color: C.ink,
    letterSpacing: -0.2,
    marginBottom: 14,
    paddingRight: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  gridFull: {
    marginBottom: 0,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  factValue: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  ref: {
    fontSize: 12,
    color: C.ink4,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.green,
  },
})

export default memo(OfferListItem)
