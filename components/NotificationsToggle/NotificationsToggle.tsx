import { FC } from 'react'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, Loader } from 'lucide-react-native'
import { Text } from '@/components/ui'
import { useUser } from '@/Providers/UserProvider'

const NotificationsToggle: FC = () => {
  const { t } = useTranslation()
  const { user, isLoading, setPushNotificationToken } = useUser()
  const pushNotificationToken = user?.pushNotificationToken

  return (
    <>
      <Text className="text-secondary-50 text-lg font-bold">{t('notifications')}: </Text>
      <Select
        key={pushNotificationToken}
        selectedValue={!!pushNotificationToken ? 'ON' : 'OFF'}
        className=""
        isDisabled={isLoading}
        onValueChange={setPushNotificationToken}
      >
        <SelectTrigger variant="outline" size="lg">
          <SelectInput className="text-primary-600 text-lg font-bold " />
          <SelectIcon className="mr-0 pr-0" as={isLoading ? Loader : ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem
              textStyle={{
                style: {
                  padding: 8,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
              }}
              label="ON"
              value={'ON'}
            />
            <SelectItem
              textStyle={{
                style: {
                  padding: 8,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
              }}
              label="OFF"
              value={'OFF'}
            />
          </SelectContent>
        </SelectPortal>
      </Select>
    </>
  )
}

export default NotificationsToggle
