import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from 'react-native'
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Share2, Send, Anchor, CheckCircle, FileText } from 'lucide-react-native'
import { TOffer } from '@/api/types'
import { ErrorMessage } from '@/components/appUI'
import { C } from '@/components/pro/tokens'
import HtmlText from '@/components/pro/HtmlText'
import LoginToApplyModal from './LoginToApplyModal'

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

const PublicOfferDetail = () => {
  const { offerId } = useLocalSearchParams<{ offerId: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const {
    t,
    i18n: { language },
  } = useTranslation(['offer-screen', 'offer'])

  const offers = queryClient.getQueryData<TOffer[]>(['public-offers', language])
  const offer = offers?.find((o) => String(o.idoffer) === offerId)

  if (!offer) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorMessage />
      </View>
    )
  }

  const salary = [offer.salary_From, offer.salary_To].filter(Boolean).join(' – ') || '—'
  const ref = offer.reference?.split('_')[1] || offer.reference
  const imbarco = [offer.boarding, offer.duration].filter(Boolean).join('\n')

  const facts: [string, string | undefined][] = [
    [t('salary-per-month', { ns: 'offer' }), salary],
    [t('base', { ns: 'offer' }), offer.positionArm],
    [t('contract-type', { ns: 'offer' }), offer.contractDescription],
    [t('owner-type', { ns: 'offer' }), offer.ownerDescription],
    [t('posted', { ns: 'offer' }), offer.offerdate],
  ]

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${offer.offer}\n\nRef: ${offer.reference}`,
        title: offer.offer,
      })
    } catch {}
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Sticky header ── */}
      <View style={ds.stickyHeader}>
        <View style={ds.navRow}>
          <Pressable style={ds.iconBtn} onPress={() => router.back()}>
            <ChevronLeft size={18} color={C.ink2} strokeWidth={2.2} />
          </Pressable>
          <Text style={ds.refText}>
            {t('job-reference', { ns: 'offer' })} · {ref}
          </Text>
          <View style={{ width: 20 }} />
        </View>

        {offer.mainPosition ? (
          <View style={ds.chipRow}>
            <View style={ds.posChip}>
              <Text style={ds.posChipText}>{offer.mainPosition}</Text>
            </View>
          </View>
        ) : null}

        <Text style={ds.headerTitle}>{offer.offer?.trim() || offer.title}</Text>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={ds.scrollContent}>
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

        {offer.mainPosition && (
          <DetailSection title={t('main-position', { ns: 'offer' })} icon={Anchor}>
            <HtmlText style={ds.sectionBody}>{offer.mainPosition}</HtmlText>
          </DetailSection>
        )}
        {offer.requirements && (
          <DetailSection title={t('requirements', { ns: 'offer' })} icon={CheckCircle}>
            <HtmlText style={ds.sectionBody}>{offer.requirements}</HtmlText>
          </DetailSection>
        )}
        {(offer.descriptionOffer || offer.offer) && (
          <DetailSection title={t('description', { ns: 'offer' })} icon={FileText}>
            <HtmlText style={ds.sectionBody}>{offer.descriptionOffer || offer.offer}</HtmlText>
          </DetailSection>
        )}
      </ScrollView>

      {/* ── Fixed action bar ── */}
      <View style={ds.actionBar}>
        <Pressable style={ds.secondaryBtn} onPress={handleShare}>
          <Share2 size={20} color={C.ink2} strokeWidth={1.8} />
        </Pressable>
        <Pressable style={ds.applyBtn} onPress={() => setShowLoginModal(true)}>
          <Send size={17} color="#FFFFFF" strokeWidth={2} />
          <Text style={ds.applyBtnText}>{t('apply-for-this-position', { ns: 'offer-screen' })}</Text>
        </Pressable>
      </View>

      <LoginToApplyModal visible={showLoginModal} onClose={() => setShowLoginModal(false)} />
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
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
})

export default PublicOfferDetail

PublicOfferDetail.displayName = 'PublicOfferDetail'
