// app/(tabs)/settings/switch-user.tsx
import { useMutation } from '@tanstack/react-query'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import AuthScreen from '@/components/appUI/AuthScreen'
import { AuthTypes } from '@/api/types'
import { router } from 'expo-router'
import { useMemo } from 'react'

const SwitchUser = () => {
  const { signIn } = useSession()
  const { user, activeProfile, switchProfile } = useUser()
  const showErrorToast = useAuthErrorToast()

  const activeRole = activeProfile?.role as AuthTypes.UserRole
  const targetRole = useMemo(
    () => (activeRole === AuthTypes.UserRole.CREW ? AuthTypes.UserRole.RECRUITER : AuthTypes.UserRole.CREW),
    [activeRole]
  )

  const { mutate: handleSignIn, isPending } = useMutation({
    mutationFn: ({ email, password }: FormDate) => signIn(email, password),
    onSuccess: async () => {
      await switchProfile?.(targetRole)
      router.replace('/')
    },
    onError: showErrorToast,
  })

  return (
    <AuthScreen>
      <AuthenticationForm
        authenticate={handleSignIn}
        isLoading={isPending}
        user={{ email: user?.email as string, role: activeRole }}
      />
    </AuthScreen>
  )
}

export default SwitchUser
