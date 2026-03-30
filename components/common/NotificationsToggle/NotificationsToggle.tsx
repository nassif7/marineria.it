import { FC } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Switch } from '@/lib/components/ui'

interface INotificationsToggleProps {
  enabled: boolean
  isPending: boolean
  handleSetPushNotification: () => void
}

const NotificationsToggle: FC<INotificationsToggleProps> = ({ enabled, isPending, handleSetPushNotification }) => {
  return (
    <View style={{ position: 'relative' }}>
      <Switch value={enabled} onToggle={handleSetPushNotification} isDisabled={isPending} />
      {isPending && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 999,
          }}
        >
          <ActivityIndicator size="small" color="rgb(255,102,51)" />
        </View>
      )}
    </View>
  )
}

export default NotificationsToggle
