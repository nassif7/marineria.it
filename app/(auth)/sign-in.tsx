import { router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useSession } from '@/Providers/SessionProvider'
import AuthenticationForm, { FormDate } from '@/components/common/AuthenticationForm'
import { useAuthErrorToast } from '@/hooks/useAuthErrorToast'
import AuthScreen from '@/components/appUI/AuthScreen'
import { Link, LinkText, VStack, Divider } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
  const { t } = useTranslation('login-screen')
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
      <Divider className="my-4" />

      <VStack>
        <Link href="https://www.marineria.it/En/Forgot_PSW.aspx" className="mb-1">
          <LinkText>{t('forgot-password')}</LinkText>
        </Link>

        <Link href="https://www.marineria.it/En/Rec/Reg.aspx" className="mb-1">
          <LinkText>{t('register-as-recruiter')}</LinkText>
        </Link>

        <Link href="https://www.marineria.it/En/Pro/Reg.aspx">
          <LinkText>{t('register-as-crew')}</LinkText>
        </Link>
      </VStack>
    </AuthScreen>
  )
}

export default SignIn
