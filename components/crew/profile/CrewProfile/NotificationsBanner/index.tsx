import { FC } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Bell } from 'lucide-react-native'
import { TNotification } from '@/api/types'
import { styles } from './styles'

const NotificationsBanner: FC<{ notifications: TNotification[] }> = ({ notifications }) => {
  const { t } = useTranslation('home-screen')
  const router = useRouter()

  const real = notifications.filter((n) => n.title || n.message)
  const unreadCount = real.filter((n) => !n.isread).length
  const hasUnread = unreadCount > 0
  const isActionable = real.length > 0
  const Banner = isActionable ? Pressable : View

  return (
    <Banner style={styles.notifBanner} onPress={isActionable ? () => router.push('/notifications') : undefined}>
      <View style={styles.notifIcon}>
        <Bell size={18} color="#fff" strokeWidth={2} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {hasUnread ? (
          <Text style={styles.notifTitle}>{t('crew-profile.notifications-new-count', { count: unreadCount })}</Text>
        ) : real.length > 0 ? (
          <Text style={styles.notifTitle}>{t('crew-profile.notifications-count', { count: real.length })}</Text>
        ) : (
          <Text style={styles.notifTitle}>{t('crew-profile.no-notifications')}</Text>
        )}
      </View>
      {isActionable && <ChevronRight size={18} color="#fff" strokeWidth={2.4} />}
    </Banner>
  )
}

export default NotificationsBanner
