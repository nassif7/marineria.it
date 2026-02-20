import { FC } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Box, VStack, HStack, Text, Divider } from '@/components/ui'
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
} from '@/components/ui/select'

type FilterType = {
  value: string
  setValue: (value: string) => void
  filterOptions: { label: string; value: string }[]
}

interface ListHeaderProps {
  itemsCount: number
  filter?: FilterType
}

export const ListHeader: FC<ListHeaderProps> = ({ itemsCount, filter }) => {
  return (
    <Box className="mb-1">
      <Box className="bg-white p-2">
        <VStack className="gap-2">
          <HStack className="items-center justify-between gap-4">
            <Box className="flex-1">
              {filter && (
                <Select
                  defaultValue={filter.value}
                  onValueChange={filter.setValue}
                  initialLabel={filter.filterOptions.find((o) => o.value === filter.value)?.label as string}
                  className=" bg-white "
                >
                  <SelectTrigger variant="rounded" size="lg" className=" flex justify-between pr-2 rounded-md">
                    <SelectInput className="text-typography-900 text-md font-semibold" />
                    <SelectIcon as={ChevronDown} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
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
              )}
            </Box>

            <Box className="bg-success-500 rounded-full w-10 h-10 items-center justify-center shrink-0">
              <Text color="white" bold>
                {itemsCount}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

interface ListProps<T> {
  data: T[]
  renderItem: ({ item }: { item: T }) => React.ReactElement
  isRefetching: boolean
  onRefresh?: () => void
  filter?: FilterType
}

export function List<T>({ data, renderItem, isRefetching, onRefresh, filter }: ListProps<T>) {
  if (!data) return null
  return (
    <FlatList
      ListHeaderComponent={() => (filter ? <ListHeader itemsCount={data?.length || 0} filter={filter} /> : null)}
      ItemSeparatorComponent={() => <Divider className="my-0.5 bg-transparent" />}
      data={data}
      renderItem={({ item }) => renderItem({ item })}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} className="text-primary-600" />}
    />
  )
}
