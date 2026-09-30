import { FC } from 'react'
import { View, Text, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TCrewUser } from '@/api/types'
import { C } from '@/components/appUI/tokens'
import Card from '../shared/Card'
import { GREEN_SOFT, GREEN_TEXT } from '../shared/colors'
import AvatarPlaceholder from './AvatarPlaceholder'
import StatsStrip from './StatsStrip'
import { styles } from './styles'

const IdentityCard: FC<{
  crew?: TCrewUser
  photoUrl: string | null
  displayName: string
  age: number | null
  isAvailable: boolean
  availabilityLabel: string
}> = ({ crew, photoUrl, displayName, age, isAvailable, availabilityLabel }) => {
  const { t } = useTranslation('home-screen')

  return (
    <Card>
      <View style={styles.identityRow}>
        {/* Avatar */}
        <View style={{ flexShrink: 0 }}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <AvatarPlaceholder size={72} radius={18} />
          )}
        </View>

        {/* Identity */}
        <View style={{ flex: 1, minWidth: 0 }}>
          {/* Name + availability badge in the same row — exactly like the design */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <Text style={[styles.name, { flex: 1 }]}>{displayName}</Text>
            <View style={[styles.availPill, { backgroundColor: isAvailable ? GREEN_SOFT : C.field, flexShrink: 0 }]}>
              {isAvailable && <View style={[styles.availDot, { backgroundColor: GREEN_TEXT }]} />}
              <Text style={[styles.availText, { color: isAvailable ? GREEN_TEXT : C.ink3 }]}>{availabilityLabel}</Text>
            </View>
          </View>

          {/* Role */}
          {crew?.mainPosition ? <Text style={styles.role}>{crew.mainPosition}</Text> : null}

          {/* Meta: nationality · age · city */}
          <Text style={styles.meta}>
            {[crew?.nationality, age ? t('crew-profile.age', { count: age }) : null, crew?.city]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
      </View>

      {/* Stats strip */}
      <StatsStrip
        numberClick={crew?.numberClick}
        calculatedExperience={crew?.calculatedExperience}
        referencesNumber={crew?.referencesNumber}
      />
    </Card>
  )
}

export default IdentityCard
