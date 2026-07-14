import React from 'react'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Globe, Bell, Users, Settings2, FileText, Shield, Star, LogOut, ChevronRight } from 'lucide-react-native'
import { router } from 'expo-router'
import { TUserRole } from '@/api/types'
import { TLocales } from '@/localization'
import { useSession } from '@/Providers/SessionProvider'
import { useProfile } from '@/hooks'
import { C } from '@/components/pro/tokens'
import SwitchLanguage from '@/components/common/SwitchLanguage'
import NotificationsToggle from '@/components/common/NotificationsToggle'
import SwitchUser from '@/components/common/SwitchUser'

const Settings = () => {
  const {
    i18n: { language, changeLanguage },
    t,
  } = useTranslation('settings-screen')
  const {
    auth: { role },
    signOut,
    isGuest,
  } = useSession()
  const { pushNotificationToken, togglePushNotifications, isTogglingNotifications } = useProfile()
  const isRecruiter = role === TUserRole.RECRUITER

  const privacyPolicyUrl =
    language === TLocales.IT ? 'https://www.marineria.it/it/contacts.aspx' : 'https://www.marineria.it/En/Contacts.aspx'

  const languageOptions = [
    { label: t('en', { ns: 'common' }), value: TLocales.EN },
    { label: t('it', { ns: 'common' }), value: TLocales.IT },
  ]

  const handleLanguageChange = async (v: string) => {
    changeLanguage(v.toLowerCase())
    await SecureStore.setItemAsync('language', v.toLowerCase())
  }

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* In-content header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>{t('title')}</Text>
      </View>

      {/* ── PREFERENCES ─────────────────────────────── */}
      <Text style={s.sectionLabel}>{t('preferences')}</Text>
      <View style={s.card}>
        {/* Language */}
        <View style={[s.row, !isGuest && s.rowBorder]}>
          <View style={[s.rowIcon, s.rowIconAccent]}>
            <Globe size={18} color={C.orange} strokeWidth={1.8} />
          </View>
          <Text style={[s.rowTitle, s.rowFlex]}>{t('language')}</Text>
          <SwitchLanguage
            language={language as TLocales}
            onLanguageChange={handleLanguageChange}
            languageOptions={languageOptions}
          />
        </View>

        {/* Push notifications — logged in only */}
        {!isGuest && (
          <View style={s.row}>
            <View style={[s.rowIcon, s.rowIconAccent]}>
              <Bell size={18} color={C.orange} strokeWidth={1.8} />
            </View>
            <View style={s.rowFlex}>
              <Text style={s.rowTitle}>{t('push-notifications')}</Text>
              <Text style={s.rowSub}>{t('push-notifications-sub')}</Text>
            </View>
            <NotificationsToggle
              enabled={!!pushNotificationToken}
              handleSetPushNotification={togglePushNotifications}
              isPending={isTogglingNotifications}
            />
          </View>
        )}
      </View>

      {/* ── ACCOUNT ──────────────────────────────────── */}
      <Text style={s.sectionLabel}>{t('account')}</Text>
      <View style={s.card}>
        {isGuest ? (
          <Pressable style={s.row} onPress={() => router.replace('/sign-in')}>
            <View style={[s.rowIcon, s.rowIconAccent]}>
              <Users size={18} color={C.orange} strokeWidth={1.8} />
            </View>
            <Text style={[s.rowTitle, s.rowFlex]}>{t('login')}</Text>
            <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
          </Pressable>
        ) : (
          <>
            {/* Switch profile */}
            <SwitchUser
              renderTrigger={({ onPress }) => (
                <Pressable style={[s.row, s.rowBorder]} onPress={onPress}>
                  <View style={[s.rowIcon, s.rowIconAccent]}>
                    <Users size={18} color={C.orange} strokeWidth={1.8} />
                  </View>
                  <View style={s.rowFlex}>
                    <Text style={s.rowTitle}>{t('switch-profile')}</Text>
                    <Text style={s.rowSub}>{isRecruiter ? t('currently-recruiter') : t('currently-crew')}</Text>
                  </View>
                  <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
                </Pressable>
              )}
            />

            {/* Security & password */}
            <Pressable
              style={[s.row, s.rowBorder]}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  language === TLocales.IT
                    ? 'https://www.marineria.it/it/ChangePassword.aspx'
                    : 'https://www.marineria.it/En/ChangePassword.aspx'
                )
              }
            >
              <View style={[s.rowIcon, s.rowIconAccent]}>
                <Settings2 size={18} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={[s.rowTitle, s.rowFlex]}>{t('security-password')}</Text>
              <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
            </Pressable>

            {/* Terms of service */}
            <Pressable
              style={[s.row, s.rowBorder]}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  language === TLocales.IT
                    ? 'https://www.marineria.it/it/contacts.aspx'
                    : 'https://www.marineria.it/En/contacts.aspx'
                )
              }
            >
              <View style={[s.rowIcon, s.rowIconAccent]}>
                <FileText size={18} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={[s.rowTitle, s.rowFlex]}>{t('terms-of-service')}</Text>
              <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
            </Pressable>

            {/* Privacy */}
            <Pressable style={[s.row, s.rowBorder]} onPress={() => WebBrowser.openBrowserAsync(privacyPolicyUrl)}>
              <View style={[s.rowIcon, s.rowIconAccent]}>
                <Shield size={18} color={C.orange} strokeWidth={1.8} />
              </View>
              <Text style={[s.rowTitle, s.rowFlex]}>{t('privacy')}</Text>
              <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
            </Pressable>

            {/* Sign out */}
            <Pressable style={s.row} onPress={() => signOut(role as TUserRole)}>
              <View style={[s.rowIcon, s.rowIconDanger]}>
                <LogOut size={18} color="#DC2626" strokeWidth={1.8} />
              </View>
              <Text style={[s.rowTitle, s.rowTitleDanger, s.rowFlex]}>{t('sign-out')}</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* ── SUPPORT ──────────────────────────────────── */}
      <Text style={s.sectionLabel}>{t('support')}</Text>
      <View style={s.card}>
        <Pressable style={s.row}>
          <View style={[s.rowIcon, s.rowIconAccent]}>
            <Star size={18} color={C.orange} strokeWidth={1.8} />
          </View>
          <Text style={[s.rowTitle, s.rowFlex]}>{t('leave-feedback')}</Text>
          <ChevronRight size={16} color={C.ink4} strokeWidth={2} />
        </Pressable>
      </View>

      <Text style={s.version}>{t('version', { version: '2.4.1' })}</Text>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: C.ink3,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: '#0D1B2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.hair2,
  },
  rowFlex: {
    flex: 1,
    minWidth: 0,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.field,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowIconAccent: {
    backgroundColor: C.orangeSoft,
  },
  rowIconDanger: {
    backgroundColor: '#FEF2F2',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.ink,
    letterSpacing: -0.1,
  },
  rowTitleDanger: {
    color: '#DC2626',
  },
  rowSub: {
    fontSize: 12,
    color: C.ink3,
    marginTop: 1,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: C.ink4,
    letterSpacing: 0.2,
    marginTop: 20,
  },
})

export default Settings

Settings.displayName = 'Settings'
