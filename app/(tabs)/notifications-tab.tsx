import { Redirect } from 'expo-router'

// tabPress on this tab is always intercepted in (tabs)/_layout.tsx to push the real
// (modals)/notifications screen instead of switching to this one — this file only
// exists so expo-router has a route to mount for the tab entry, and redirects to the
// modal as a safety net for the rare case it gets displayed anyway (e.g. deep link).
const NotificationsTabScreen = () => <Redirect href="/notifications" />

export default NotificationsTabScreen
