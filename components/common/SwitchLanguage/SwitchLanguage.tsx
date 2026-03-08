import { FC } from 'react'
import { ChevronDownIcon } from 'lucide-react-native'
import { TLocales } from '@/localization'
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

interface ISwitchLanguageProps {
  language: TLocales
  onLanguageChange: (value: string) => void
  languageOptions: { label: string; value: TLocales }[]
  initialLabel: string
}

const SwitchLanguage: FC<ISwitchLanguageProps> = ({ language, onLanguageChange, languageOptions, initialLabel }) => {
  return (
    <Select key={language} selectedValue={language} initialLabel={initialLabel} onValueChange={onLanguageChange}>
      <SelectTrigger variant="outline" size="md">
        <SelectInput />
        <SelectIcon className="mr-1" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="bg-white rounded-md">
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {languageOptions.map((l) => (
            <SelectItem
              key={l.value}
              textStyle={{
                style: {
                  padding: 8,
                  fontSize: 18,
                  fontWeight: 'bold',
                },
              }}
              label={l.label}
              value={l.value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  )
}

export default SwitchLanguage
