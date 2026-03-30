import { FC } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Box, VStack, HStack, Text, Divider } from '@/lib/components/ui'
import { ChevronDown } from 'lucide-react-native'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from '@/lib/components/ui/select'

type FilterType = {
  value: string
  setValue: (value: string) => void
  filterOptions: { label: string; value: string }[]
}

interface ListHeaderProps {
  itemsCount: number
  filter: FilterType
}

export const ListHeader: FC<ListHeaderProps> = ({ filter }) => {
  return (
    <Box className="mb-1">
      <Box className="bg-white p-2 w-full">
        <VStack className="gap-2">
          <HStack className="items-center justify-between gap-4">
            <Select
              defaultValue={filter.value}
              onValueChange={filter.setValue}
              initialLabel={filter.filterOptions.find((o) => o.value === filter.value)?.label as string}
              className=" bg-white w-full"
            >
              <SelectTrigger variant="rounded" size="md" className=" flex justify-between pr-2 rounded-md">
                <SelectInput />
                <SelectIcon as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="bg-white rounded-md">
                  {filter.filterOptions.map((o) => (
                    <SelectItem
                      textStyle={{
                        style: {
                          padding: 8,
                          fontSize: 18,
                          fontWeight: 'bold',
                        },
                      }}
                      label={o.label}
                      value={o.value}
                      key={o.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

interface ListProps<T> {
  noHeader?: boolean
  data: T[]
  renderItem: ({ item }: { item: T }) => React.ReactElement
  listEmptyComponent?: React.ReactElement
  isRefetching: boolean
  onRefresh?: () => void
  filter?: FilterType
}

export function List<T>({
  data,
  renderItem,
  isRefetching,
  onRefresh,
  filter,
  noHeader,
  listEmptyComponent,
}: ListProps<T>) {
  // TODO: add empty state
  if (!data) return null
  return (
    <FlatList
      ListHeaderComponent={() => (filter ? <ListHeader itemsCount={data.length} filter={filter} /> : null)}
      ItemSeparatorComponent={() => <Divider className="my-0.5 bg-transparent" />}
      data={data}
      renderItem={({ item }) => renderItem({ item })}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} className="text-primary-600" />}
      removeClippedSubviews={false}
      ListEmptyComponent={listEmptyComponent}
    />
  )
}
