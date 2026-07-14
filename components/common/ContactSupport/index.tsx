import React, { FC, useState } from 'react'
import { Modal, View, Text, Pressable, ScrollView, Image, Linking, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { X, Headphones, Mail, Phone, MessageCircle, Send } from 'lucide-react-native'
import { TSupportTeam } from '@/api'
import { C } from '@/components/pro/tokens'

type IContactSupportProps = {
  title: string
  supportTeam: TSupportTeam[]
  isTextTrigger?: boolean
  renderTrigger?: (props: { onPress: () => void }) => React.ReactNode
}

const GREEN_TEXT = '#0F7A28'
const GREEN_SOFT = '#E8F8EB'

const ContactRow: FC<{ icon: FC<any>; label: string; value: string; onPress: () => void; last?: boolean }> = ({
  icon: Icon,
  label,
  value,
  onPress,
  last,
}) => (
  <Pressable style={[cs.contactRow, last && cs.contactRowLast]} onPress={onPress}>
    <View style={cs.contactIcon}>
      <Icon size={16} color={C.orange} strokeWidth={1.8} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={cs.contactLabel}>{label}</Text>
      <Text style={cs.contactValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </Pressable>
)

const SupportMemberCard: FC<{ member: TSupportTeam }> = ({ member }) => {
  const { t } = useTranslation('common')
  const fullName = `${member.firstName} ${member.lastName}`
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()

  return (
    <View style={cs.card}>
      <View style={cs.memberRow}>
        <View style={cs.avatar}>
          {member.photoUrl ? (
            <Image source={{ uri: member.photoUrl }} style={cs.avatarImg} />
          ) : (
            <Text style={cs.avatarInitials}>{initials}</Text>
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={cs.memberName}>{fullName}</Text>
          {member.position ? <Text style={cs.memberPosition}>{member.position}</Text> : null}
          <View style={[cs.statusPill, member.isOnline ? cs.statusPillOnline : cs.statusPillOffline]}>
            <View style={[cs.statusDot, { backgroundColor: member.isOnline ? GREEN_TEXT : C.ink4 }]} />
            <Text style={[cs.statusText, { color: member.isOnline ? GREEN_TEXT : C.ink4 }]}>
              {member.isOnline ? t('online', { defaultValue: 'Online' }) : t('offline', { defaultValue: 'Offline' })}
            </Text>
          </View>
        </View>
      </View>

      <View style={cs.divider} />

      <ContactRow
        icon={Mail}
        label={t('email')}
        value={member.email}
        onPress={() => Linking.openURL(`mailto:${member.email}`)}
      />
      <ContactRow
        icon={Phone}
        label={t('phone', { defaultValue: 'Phone' })}
        value={member.phoneNumber}
        onPress={() => Linking.openURL(`tel:${member.phoneNumber.replace(/\s/g, '')}`)}
      />
      <ContactRow
        icon={MessageCircle}
        label="WhatsApp"
        value={member.whatsApp}
        onPress={() => Linking.openURL(`https://wa.me/${member.whatsApp.replace(/\D/g, '')}`)}
      />
      {member.telegram ? (
        <ContactRow
          icon={Send}
          label="Telegram"
          value={member.telegram}
          onPress={() => Linking.openURL(`https://t.me/${member.telegram!.replace('@', '')}`)}
          last
        />
      ) : null}
    </View>
  )
}

export const ContactSupportIconTrigger: FC<{ onPress: () => void }> = ({ onPress }) => (
  <Pressable style={cs.iconTrigger} onPress={onPress}>
    <Headphones size={18} color={C.ink2} strokeWidth={1.8} />
  </Pressable>
)

export const ContactSupportTextTrigger: FC<{ onPress: () => void }> = ({ onPress }) => {
  const { t } = useTranslation('common')
  return (
    <Pressable onPress={onPress}>
      <Text style={cs.textTrigger}>{t('contact-support')}</Text>
    </Pressable>
  )
}

const ContactSupport: FC<IContactSupportProps> = ({ title, supportTeam, isTextTrigger, renderTrigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { top, bottom } = useSafeAreaInsets()
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ onPress: open })
      ) : isTextTrigger ? (
        <ContactSupportTextTrigger onPress={open} />
      ) : (
        <ContactSupportIconTrigger onPress={open} />
      )}

      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={close}>
        <View style={[cs.container, { paddingTop: top }]}>
          <View style={cs.header}>
            <Text style={cs.headerTitle}>{title}</Text>
            <Pressable style={cs.closeBtn} onPress={close}>
              <X size={16} color={C.ink2} strokeWidth={2.5} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: bottom + 24 }}
            showsVerticalScrollIndicator={false}
          >
            {supportTeam.map((member, index) => (
              <SupportMemberCard key={index} member={member} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

const cs = StyleSheet.create({
  iconTrigger: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTrigger: {
    fontSize: 14,
    fontWeight: '700',
    color: C.orange,
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.hair2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    paddingTop: 18,
    paddingBottom: 6,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.orangeSoft,
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
    fontSize: 20,
    fontWeight: '800',
    color: C.orange,
    letterSpacing: -0.5,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.2,
  },
  memberPosition: {
    fontSize: 13,
    color: C.ink3,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  statusPillOnline: {
    backgroundColor: GREEN_SOFT,
  },
  statusPillOffline: {
    backgroundColor: C.field,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: C.hair2,
    marginTop: 16,
    marginHorizontal: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  contactRowLast: {
    borderBottomWidth: 0,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.orangeSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: C.ink4,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.ink,
  },
})

export default ContactSupport

ContactSupport.displayName = 'ContactSupport'
