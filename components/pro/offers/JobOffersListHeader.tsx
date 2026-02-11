import React from 'react'
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
import { HStack, Loading, ListEmptyComponent, Divider, Box } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon } from 'lucide-react-native'

interface JobOffersListHeaderProps {
  setOwnOffersFilter: (v: string) => void
  filterValue: string
}

const selectOptions = [
  { label: 'allOffers', value: 'all' },
  { label: 'ownOffers', value: 'own' },
]

const JobOffersListHeader: React.FC<JobOffersListHeaderProps> = ({ filterValue, setOwnOffersFilter }) => {
  const { t } = useTranslation()
  return (
    <Box className=" bg-outline-200 rounded">
      <Select
        defaultValue={filterValue}
        initialLabel={t(selectOptions.find((o) => o.value === filterValue)?.label as string)}
        className="m-3 bg-white rounded"
        onValueChange={(v) => setOwnOffersFilter(v)}
      >
        <SelectTrigger variant="outline" size="xl" className="flex justify-between">
          <SelectInput className="text-primary-600 text-lg font-bold" />
          <SelectIcon className="mr-0 pr-0" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {selectOptions.map((o) => (
              <SelectItem
                textStyle={{
                  style: {
                    padding: 8,
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                }}
                label={t(o.label)}
                value={o.value}
                key={o.value}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </Box>
  )
}

export default JobOffersListHeader
