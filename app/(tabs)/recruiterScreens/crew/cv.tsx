import { ScrollView } from 'react-native'
import { Card, Box } from '@/components/ui-lib'
import { useTranslation } from 'react-i18next'

const OfferScreen = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()

  return (
    <ScrollView className="">
      <Card>
        <Box>CV</Box>
      </Card>
    </ScrollView>
  )
}

export default OfferScreen
