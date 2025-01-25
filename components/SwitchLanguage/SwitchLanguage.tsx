import { FC, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useTranslation } from 'react-i18next'
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
import { ChevronDownIcon } from 'lucide-react-native'
import { Text } from '@/components/ui'

enum Locales {
  EN = 'en',
  IT = 'it',
}

const SwitchLanguage: FC = () => {
  const {
    i18n: { language, changeLanguage },
    t,
  } = useTranslation()

  const onLanguageChange = async (v: string) => {
    changeLanguage(v.toLocaleLowerCase())
    await SecureStore.setItemAsync('language', v.toLocaleLowerCase())
  }

  return (
    <>
      <Text className="text-secondary-50 text-lg font-bold">{t('changeLanguage')}: </Text>
      <Select
        key={language}
        selectedValue={language}
        initialLabel={t(language)}
        className=""
        onValueChange={onLanguageChange}
      >
        <SelectTrigger variant="outline" size="lg">
          <SelectInput className="text-primary-600 text-lg font-bold" />
          <SelectIcon className="mr-0 pr-0" as={ChevronDownIcon} />
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
              label={t('it')}
              value={Locales.IT}
            />
            <SelectItem
              textStyle={{
                style: {
                  padding: 8,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
              }}
              label={t('en')}
              value={Locales.EN}
            />
          </SelectContent>
        </SelectPortal>
      </Select>
    </>
  )
}

export default SwitchLanguage
