import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useSession } from '@/Providers/SessionProvider'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import { AuthScreen, LoginFormLinks } from '@/components/appUI'
import { Divider } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
  const { signIn } = useSession()
  const showErrorToast = useAuthErrorToast()

  const { mutate: handleSignIn, isPending } = useMutation({
    mutationFn: ({ email, password }: FormDate) => signIn(email, password),
    onSuccess: () => router.replace('/'),
    onError: showErrorToast,
  })

  return (
    <AuthScreen>
      <AuthenticationForm authenticate={handleSignIn} isLoading={isPending} />
      <Divider className="bg-outline-300 my-4" />
      <LoginFormLinks />
    </AuthScreen>
  )
}

export default SignIn
