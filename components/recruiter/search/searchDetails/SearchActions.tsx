// components/search/SearchActions.tsx
import React from 'react'
import { VStack, Button, ButtonText, ButtonIcon } from '@/components/ui'
import { Edit, MessageCircleQuestionMark } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { TRecruiterSearch } from '@/api/types/search'
import { Section } from '@/components/appUI'

interface SearchActionsProps {
  onEdit: () => void
  isUrlLoading?: boolean
}

const SearchActions: React.FC<SearchActionsProps> = ({ onEdit, isUrlLoading }) => {
  const { t } = useTranslation()

  return (
    <Section>
      <VStack space="xs">
        <Button
          size="lg"
          action="primary"
          variant="outline"
          onPress={onEdit}
          className="rounded-md"
          isDisabled={isUrlLoading}
        >
          <ButtonIcon as={Edit} />
          <ButtonText className="ml-2">{t('modify-offer')}</ButtonText>
        </Button>
      </VStack>
    </Section>
  )
}

export default SearchActions
