import { useMutation } from '@tanstack/react-query'
import { useSession } from '@/Providers/SessionProvider'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import AuthScreen from '@/components/appUI/AuthScreen'
import { router } from 'expo-router'

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
    </AuthScreen>
  )
}

export default SignIn
