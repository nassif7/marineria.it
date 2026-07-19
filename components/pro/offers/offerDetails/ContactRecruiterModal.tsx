import { FC, memo } from 'react'
import { Modal, View, Text, Pressable, Linking, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, Mail, Phone, MessageCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { C } from '@/components/pro/tokens'

interface IContactRecruiterModal {
  visible: boolean
  onClose: () => void
  name?: string
  email?: string
  phone?: string
  whatsapp?: string
}

const openUrl = (url: string) => Linking.openURL(url).catch(() => {})

const getInitials = (name?: string) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

const ContactRow: FC<{ icon: FC<any>; label: string; value: string; onPress: () => void; last?: boolean }> = ({
  icon: Icon,
  label,
  value,
  onPress,
  last,
}) => (
  <Pressable style={[cr.contactRow, last && cr.contactRowLast]} onPress={onPress}>
    <View style={cr.contactIcon}>
      <Icon size={16} color={C.orange} strokeWidth={1.8} />
    </View>
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={cr.contactLabel}>{label}</Text>
      <Text style={cr.contactValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </Pressable>
)

const ContactRecruiterModal: FC<IContactRecruiterModal> = ({ visible, onClose, name, email, phone, whatsapp }) => {
  const { t } = useTranslation(['offer-screen', 'crew', 'common'])
  const { bottom } = useSafeAreaInsets()

  const rows = [
    email
      ? { icon: Mail, label: t('email', { ns: 'crew' }), value: email, onPress: () => openUrl(`mailto:${email}`) }
      : null,
    phone
      ? {
          icon: Phone,
          label: t('phone', { ns: 'crew' }),
          value: phone,
          onPress: () => openUrl(`tel:${phone.replace(/\s/g, '')}`),
        }
      : null,
    whatsapp
      ? {
          icon: MessageCircle,
          label: t('whatsapp', { ns: 'crew' }),
          value: whatsapp,
          onPress: () => openUrl(`https://wa.me/${whatsapp.replace(/\D/g, '')}`),
        }
      : null,
  ].filter((r): r is NonNullable<typeof r> => r !== null)

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={cr.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={[cr.card, { marginBottom: Math.max(bottom, 20) }]}>
          <View style={cr.header}>
            <Text style={cr.headerTitle}>{t('contact-recruiter', { ns: 'offer-screen' })}</Text>
            <Pressable style={cr.closeBtn} onPress={onClose}>
              <X size={16} color={C.ink2} strokeWidth={2.5} />
            </Pressable>
          </View>

          <View style={cr.memberRow}>
            <View style={cr.avatar}>
              <Text style={cr.avatarInitials}>{getInitials(name)}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={cr.memberName}>{name || t('contact-recruiter', { ns: 'offer-screen' })}</Text>
            </View>
          </View>

          <View style={cr.divider} />

          {rows.map((row, i) => (
            <ContactRow key={row.label} {...row} last={i === rows.length - 1} />
          ))}
        </View>
      </View>
    </Modal>
  )
}

const cr = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(13,27,42,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingBottom: 4,
    overflow: 'hidden',
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.32,
    shadowRadius: 32,
    elevation: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.hair,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.hair2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 18,
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

export default memo(ContactRecruiterModal)

ContactRecruiterModal.displayName = 'ContactRecruiterModal'
