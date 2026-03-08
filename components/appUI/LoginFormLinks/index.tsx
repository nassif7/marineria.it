import { FC } from 'react'
import { Link, LinkText, VStack } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface ILoginFormLinksProps {
  isCrew?: boolean
  isRecruiter?: boolean
}

const LoginFormLinks: FC<ILoginFormLinksProps> = ({ isCrew, isRecruiter }) => {
  const { t } = useTranslation('login-screen')

  return (
    <VStack className="rounded-md bg-background-100 flex justify-items-start items-start">
      <Link href="https://www.marineria.it/En/Forgot_PSW.aspx" className="mb-1">
        <LinkText>{t('forgot-password')}</LinkText>
      </Link>
      {!isRecruiter && (
        <Link href="https://www.marineria.it/En/Rec/Reg.aspx" className="mb-1">
          <LinkText>{t('register-as-recruiter')}</LinkText>
        </Link>
      )}
      {!isCrew && (
        <Link href="https://www.marineria.it/En/Pro/Reg.aspx">
          <LinkText>{t('register-as-crew')}</LinkText>
        </Link>
      )}
    </VStack>
  )
}

export default LoginFormLinks
