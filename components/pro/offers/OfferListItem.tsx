import React, { FC, useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getProUserOffers } from '@/api'
import { useAppState, useFetch } from '@/hooks'
import { useUser, ActiveProfile } from '@/Providers/UserProvider'

import JobOfferListItem from './JobOfferListItem'
import JobOffersListHeader from './JobOffersListHeader'

import { ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Box, VStack, HStack, Heading, Text, Button, ButtonText, ButtonIcon, Pressable, Icon } from '@/components/ui'
import { Eye, Calendar, DollarSign, MapPin, Clock, ChevronDown, AlertCircle, Briefcase } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { router } from 'expo-router'

interface IOfferListItemProps {
  offer: any
}

const OfferListItem: FC<IOfferListItemProps> = ({ offer }) => {
  const handleViewOffer = (offerId: number) => {
    router.push(`/pro/offers/${offerId}`)
  }
  return (
    <Box key={offer.idoffer} className="bg-white rounded-xl shadow-sm overflow-hidden">
      <VStack className="gap-0">
        {/* Header with Title */}
        <Box className="p-4 pb-3">
          <Heading size="lg" className="text-primary-600 leading-tight mb-2">
            {offer.offer.trim()}
          </Heading>

          <HStack className="justify-between items-center">
            <Text className="text-typography-500 text-sm">[Ref.: {offer.reference.split('_')[1]}]</Text>
            <Text className="text-typography-500 text-sm">{offer.offerdate}</Text>
          </HStack>
        </Box>

        {/* Not Applicable Badge */}
        {!offer.offerApplicable && (
          <Box className="px-4 pb-3">
            <Box className="bg-warning-50 border border-warning-200 rounded-lg px-3 py-2">
              <HStack className="items-center gap-2">
                <Icon as={AlertCircle} className="text-warning-600" size="sm" />
                <Text className="text-warning-900 font-semibold text-xs">Not applicable</Text>
              </HStack>
            </Box>
          </Box>
        )}

        {/* Info Section */}
        <Box className="px-4 pb-4">
          <VStack className="gap-2">
            {/* Salary & Duration */}
            <VStack className="gap-3">
              <Box className="bg-success-50 border border-success-200 rounded-lg px-3 py-2 flex-1">
                <VStack className="gap-0.5">
                  <HStack className="items-center gap-1">
                    <Icon as={DollarSign} className="text-success-600" size="xs" />
                    <Text className="text-success-600 text-xs font-medium">Salary</Text>
                  </HStack>
                  <Text className="text-success-900 font-bold text-sm">
                    {offer.salary_From} - {offer.salary_To}
                  </Text>
                </VStack>
              </Box>

              <Box className="bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 flex-1">
                <VStack className="gap-0.5">
                  <HStack className="items-center gap-1">
                    <Icon as={Calendar} className="text-primary-600" size="xs" />
                    <Text className="text-primary-600 text-xs font-medium">Duration</Text>
                  </HStack>
                  <HStack>
                    <Text className="text-primary-900 font-bold text-sm">
                      From: {offer.offerdate.split(',')[1].trim() + ' '}
                    </Text>
                    <Text className="text-primary-900 font-bold text-sm">
                      To: {offer.duration || offer.offertExpirationdate}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>

            {/* Additional Info Pills */}
            <HStack className="gap-2 flex-wrap mt-1">
              {offer.positionArm && offer.positionArm !== 'N/A' && (
                <Box className="bg-background-50 rounded-lg px-3 py-1.5">
                  <HStack className="items-center gap-1.5">
                    <Icon as={MapPin} className="text-typography-500" size="xs" />
                    <Text className="text-typography-900 text-xs font-medium">{offer.positionArm}</Text>
                  </HStack>
                </Box>
              )}

              <Box className="bg-background-50 rounded-lg px-3 py-1.5">
                <HStack className="items-center gap-1.5">
                  <Icon as={Briefcase} className="text-typography-500" size="xs" />
                  <Text className="text-typography-900 text-xs font-medium">{offer.contractDescription}</Text>
                </HStack>
              </Box>

              <Box className="bg-background-50 rounded-lg px-3 py-1.5">
                <HStack className="items-center gap-1.5">
                  <Icon as={Clock} className="text-typography-500" size="xs" />
                  <Text className="text-typography-900 text-xs font-medium">{offer.boarding}</Text>
                </HStack>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* View Button */}
        <Box className="px-4 pb-4">
          <Button
            size="lg"
            action="positive"
            variant="solid"
            onPress={() => handleViewOffer(offer.idoffer)}
            className="w-full rounded-xl"
          >
            <ButtonIcon as={Eye} />
            <ButtonText className="ml-2">View offer</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default OfferListItem
