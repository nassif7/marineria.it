import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Share, ActivityIndicator } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Bookmark, Share2, Anchor, CheckCircle, FileText } from 'lucide-react-native'
import { getProOfferById, getProOfferByIdPost, applyToOffer, getWhyCanNotApplyPost } from '@/api'
import { ApiError, parseServerBool } from '@/api/utils'
import { useCrew } from '@/Providers/CrewProvider'
import { useTranslation } from 'react-i18next'
import { useStatusToast, useSavedOffers } from '@/hooks'
import { Loading } from '@/components/ui'
import { ErrorMessage, ScreenContainer } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import HtmlText from '@/components/pro/HtmlText'
import NotApplicableModal from './NotApplicableModal'
import ApplyModal from './ApplyModal'

const MATCH_BG = '#E8F5EE'
const MATCH_TEXT = '#1B7F4E'

// Saved-offers API isn't ready yet — hide the save/bookmark controls without removing the logic.
const SHOW_SAVE_OFFER = false

// ─── Shared atoms ─────────────────────────────────────────────

function MatchChip({ matching, label }: { matching: boolean; label: string }) {
  return (
    <View style={[ds.matchChip, { backgroundColor: matching ? MATCH_BG : C.orangeSoft }]}>
      <Text style={[ds.matchText, { color: matching ? MATCH_TEXT : C.orangeText }]}>{label}</Text>
    </View>
  )
}

function DetailSection({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <View style={ds.section}>
      <View style={ds.sectionHeader}>
        <Icon size={16} color={C.ink3} strokeWidth={1.8} />
        <Text style={ds.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

// ─── Screen ───────────────────────────────────────────────────

export default function OfferDetailsScreen() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const {
    i18n: { language },
    t,
  } = useTranslation(['offer-screen', 'offer', 'common'])
  const { showToast } = useStatusToast()

  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const { token, crew: user } = useCrew()
  const isCvPublished = parseServerBool(user?.published)
  const { isSaved: checkSaved, toggleSaved } = useSavedOffers()
  const isSaved = offerId ? checkSaved(offerId) : false
  const [showNotApplicable, setShowNotApplicable] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [pendingReasons, setPendingReasons] = useState(false)

  // const { data: whyCanNotApplyReasons, isFetching: isFetchingReasons } = useQuery({
  //   queryKey: ['whyCanNotApply', offerId],
  //   queryFn: () => getWhyCanNotApply(parseInt(offerId as string), token, language),
  //   enabled: pendingReasons,
  // })
  const { data: whyCanNotApplyReasons, isFetching: isFetchingReasons } = useQuery({
    queryKey: ['whyCanNotApply', offerId],
    queryFn: () => getWhyCanNotApplyPost(parseInt(offerId as string), token, language),
    enabled: pendingReasons,
  })

  useEffect(() => {
    if (pendingReasons && !isFetchingReasons && whyCanNotApplyReasons) {
      setPendingReasons(false)
      setShowNotApplicable(true)
    }
  }, [pendingReasons, isFetchingReasons, whyCanNotApplyReasons])

  // const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
  //   queryKey: ['offer', offerId],
  //   queryFn: () => getProOfferById(offerId as string, token, language),
  // })

  const { isLoading, isSuccess, isError, isRefetching, refetch, data } = useQuery({
    queryKey: ['offer', offerId, language],
    queryFn: () => getProOfferByIdPost(offerId as string, token, language),
  })

  const offer = isSuccess ? data?.[0] : null

  const handleApply = () => {
    if (!offer?.offerApplicable) {
      setPendingReasons(true)
    } else if (!offer?.alreadyApplied) {
      setShowApply(true)
    }
  }

  const handleShare = async () => {
    if (!offer) return
    try {
      await Share.share({
        message: `${offer.offer}\n\nRef: ${offer.reference}`,
        title: offer.offer,
      })
    } catch {}
  }

  const { mutate: handleConfirmApply, isPending } = useMutation({
    mutationFn: () => applyToOffer(token, parseInt(offerId as string), language),
    onSuccess: () => {
      showToast({
        emphasize: 'success',
        title: t('success', { ns: 'common' }),
        description: t('apply-success', { ns: 'offer' }),
        duration: 8000,
      })
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError && error.title !== 'unknown-error' ? error.title : null
      showToast({
        emphasize: 'error',
        title: t('error', { ns: 'common', defaultValue: 'Error' }),
        description: message ?? t('unknown-error', { ns: 'common' }),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      setShowApply(false)
    },
  })

  if (isLoading || isRefetching || isPending) {
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

  const salary = [offer?.salary_From, offer?.salary_To].filter(Boolean).join(' – ') || '—'
  const ref = offer?.reference?.split('_')[1] || offer?.reference
  const imbarco = [offer?.boarding, offer?.duration].filter(Boolean).join('\n')

  const facts: [string, string | undefined][] = [
    [t('salary-per-month', { ns: 'offer' }), salary],
    [t('base', { ns: 'offer' }), offer?.positionArm],
    [t('contract-type', { ns: 'offer' }), offer?.contractDescription],
    [t('owner-type', { ns: 'offer' }), offer?.ownerDescription],
    [t('posted', { ns: 'offer' }), offer?.offerdate],
  ]

  const isMatching = !!offer?.offerApplicable
  const alreadyApplied = !!offer?.alreadyApplied
  const canApply = isCvPublished && !alreadyApplied && isMatching
  const applyLabel = alreadyApplied
    ? t('already-applied', { ns: 'offer-screen' })
    : isMatching
      ? t('apply-for-this-position', { ns: 'offer-screen' })
      : t('not-matching-why', { ns: 'offer-screen' })

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Sticky header ── */}
      <View style={ds.stickyHeader}>
        {/* Back · Ref · Bookmark */}
        <View style={ds.navRow}>
          <Pressable style={ds.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
          </Pressable>
          <Text style={ds.refText}>
            {t('job-reference', { ns: 'offer' })} · {ref}
          </Text>
          {SHOW_SAVE_OFFER ? (
            <Pressable onPress={() => toggleSaved(offerId)}>
              <Bookmark
                size={20}
                color={isSaved ? C.orange : C.ink2}
                strokeWidth={1.8}
                fill={isSaved ? C.orange : 'none'}
              />
            </Pressable>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </View>

        {/* Chips */}
        <View style={ds.chipRow}>
          {offer?.mainPosition ? (
            <View style={ds.posChip}>
              <Text style={ds.posChipText}>{offer.mainPosition}</Text>
            </View>
          ) : null}
          <MatchChip
            matching={offer?.offerApplicable ?? false}
            label={
              offer?.offerApplicable ? t('matching', { ns: 'offer-screen' }) : t('not-matching', { ns: 'offer-screen' })
            }
          />
        </View>

        {/* Title */}
        <Text style={ds.headerTitle}>{offer?.offer?.trim() || offer?.title}</Text>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ds.scrollContent}>
        {/* 2-column facts grid */}
        <View style={ds.factsGrid}>
          {!!imbarco && (
            <View style={ds.factCellFull}>
              <Text style={ds.factLabel}>{t('boarding', { ns: 'offer' })}</Text>
              <Text style={ds.factValue} numberOfLines={1}>
                {imbarco}
              </Text>
            </View>
          )}
          {facts.map(([label, value]) =>
            value ? (
              <View key={label} style={ds.factCell}>
                <Text style={ds.factLabel}>{label}</Text>
                <Text style={ds.factValue}>{value}</Text>
              </View>
            ) : null
          )}
        </View>

        {/* Sections */}
        {offer?.mainPosition && (
          <DetailSection title={t('main-position', { ns: 'offer' })} icon={Anchor}>
            <HtmlText style={ds.sectionBody}>{offer.mainPosition}</HtmlText>
          </DetailSection>
        )}
        {offer?.requirements && (
          <DetailSection title={t('requirements', { ns: 'offer' })} icon={CheckCircle}>
            <HtmlText style={ds.sectionBody}>{offer.requirements}</HtmlText>
          </DetailSection>
        )}
        {(offer?.descriptionOffer || offer?.offer) && (
          <DetailSection title={t('description', { ns: 'offer' })} icon={FileText}>
            <HtmlText style={ds.sectionBody}>{offer?.descriptionOffer || offer?.offer}</HtmlText>
          </DetailSection>
        )}
      </ScrollView>

      {/* ── Fixed action bar ── */}
      <View style={ds.actionBar}>
        {SHOW_SAVE_OFFER && (
          <Pressable style={[ds.secondaryBtn, isSaved && ds.secondaryBtnSaved]} onPress={() => toggleSaved(offerId)}>
            <Bookmark
              size={20}
              color={isSaved ? C.orange : C.ink2}
              strokeWidth={1.8}
              fill={isSaved ? C.orange : 'none'}
            />
          </Pressable>
        )}
        <Pressable style={ds.secondaryBtn} onPress={handleShare}>
          <Share2 size={20} color={C.ink2} strokeWidth={1.8} />
        </Pressable>
        <Pressable
          style={[
            ds.applyBtn,
            !isMatching && !alreadyApplied && ds.applyBtnSecondary,
            alreadyApplied && ds.applyBtnDisabled,
          ]}
          onPress={pendingReasons || alreadyApplied ? undefined : handleApply}
          disabled={pendingReasons || alreadyApplied}
        >
          {pendingReasons && <ActivityIndicator color="#FFFFFF" style={ds.btnSpinner} />}
          <Text style={[ds.applyBtnText, !isMatching && ds.applyBtnTextSecondary]}>{applyLabel}</Text>
        </Pressable>
      </View>

      <NotApplicableModal
        visible={showNotApplicable}
        onClose={() => setShowNotApplicable(false)}
        reasons={whyCanNotApplyReasons ?? []}
      />
      <ApplyModal
        visible={showApply}
        onClose={() => setShowApply(false)}
        onConfirm={handleConfirmApply}
        isSubmitting={isPending}
      />
    </View>
  )
}

const ds = StyleSheet.create({
  // ── Sticky header ──
  stickyHeader: {
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSaved: {
    borderWidth: 1,
    borderColor: C.orange,
    backgroundColor: C.orangeSoft,
  },
  refText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink3,
  },
  chipRow: {
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
  matchChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 27,
    color: C.ink,
    letterSpacing: -0.4,
  },
  // ── Scroll body ──
  scrollContent: {
    paddingBottom: 20,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    rowGap: 16,
    columnGap: 16,
  },
  factCell: {
    width: '45%',
  },
  factCellFull: {
    width: '100%',
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  factValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
    lineHeight: 19,
  },
  // ── Section ──
  section: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.ink3,
    textTransform: 'uppercase',
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: C.ink2,
  },
  // ── Action bar ──
  actionBar: {
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.hair2,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.ink2,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnSaved: {
    borderColor: C.orange,
    backgroundColor: C.orangeSoft,
  },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  btnSpinner: {
    height: 18,
    width: 18,
  },
  applyBtnSecondary: {
    backgroundColor: C.orange,
    shadowColor: C.orange,
  },
  applyBtnDisabled: {
    backgroundColor: C.ink4,
    shadowOpacity: 0,
    elevation: 0,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  applyBtnTextSecondary: {
    color: '#FFFFFF',
  },
})
