import { useMemo } from 'react'
import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { TUserRole } from '@/api/types'
import { useSession } from '@/Providers/SessionProvider'
import { useUser } from '@/Providers/UserProvider'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { AuthScreen } from '@/components/appUI'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'

const SwitchUser = () => {
  const { signIn } = useSession()
  const { user, activeProfile, switchProfile } = useUser()
  const showErrorToast = useAuthErrorToast()

  const activeRole = activeProfile?.role as TUserRole
  const targetRole = useMemo(() => (activeRole === TUserRole.CREW ? TUserRole.RECRUITER : TUserRole.CREW), [activeRole])

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
