import { FC } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import { useTranslation } from 'react-i18next'
import { styles } from './styles'
import StatusPills from './StatusPills'

const HeroCard: FC<{
  photoUrl: string | null
  photoCount: number
  initials: string
  mainPosition: string
  iduser: number
  isContacted: boolean
  name: string
  surname: string
  passport: string
  city: string
  age: number | null
  maritalStatus: string
  gender: string
  onAvatarPress: () => void
  hasSeamansBook: boolean
  hasCertificateOfCompetence: boolean
  hasCourses: boolean
  coursesCount: number
}> = ({
  photoUrl,
  photoCount,
  initials,
  mainPosition,
  iduser,
  isContacted,
  name,
  surname,
  passport,
  city,
  age,
  maritalStatus,
  gender,
  onAvatarPress,
  hasSeamansBook,
  hasCertificateOfCompetence,
  hasCourses,
  coursesCount,
}) => {
  const { t } = useTranslation(['crew'])

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
        <Pressable style={{ position: 'relative' }} disabled={photoCount === 0} onPress={onAvatarPress}>
          <View style={styles.avatar}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>
          {photoCount > 1 && (
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>{photoCount}</Text>
            </View>
          )}
        </Pressable>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.heroRole} numberOfLines={2}>
            {mainPosition || '—'}
          </Text>
          <Text style={styles.heroId}>ID · {iduser}</Text>
          {isContacted && (
            <Text style={styles.heroName}>
              {name} {surname}
            </Text>
          )}
          <Text style={styles.heroMeta} numberOfLines={3}>
            {[passport, city, age ? `${age} ${t('years', { ns: 'crew' })}` : null, maritalStatus, gender]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
      </View>

      <StatusPills
        isContacted={isContacted}
        hasSeamansBook={hasSeamansBook}
        hasCertificateOfCompetence={hasCertificateOfCompetence}
        hasCourses={hasCourses}
        coursesCount={coursesCount}
      />
    </View>
  )
}

export default HeroCard
