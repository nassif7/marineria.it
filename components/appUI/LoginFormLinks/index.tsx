import { FC } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Link, LinkText, VStack } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface ILoginFormLinksProps {
  isCrew?: boolean
  isRecruiter?: boolean
}

const LoginFormLinks: FC<ILoginFormLinksProps> = ({ isCrew, isRecruiter }) => {
  const { t } = useTranslation('login-screen')

  const handleRegisterAsRecruiter = () => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Rec/Reg.aspx')
  const handleRegisterAsCrew = () => WebBrowser.openBrowserAsync('https://www.marineria.it/En/Pro/Reg.aspx')

  return (
    <VStack className="flex items-start rounded-md bg-background-100 justify-items-start">
      {!isRecruiter && (
        <Link onPress={handleRegisterAsRecruiter} className="mb-1">
          <LinkText>{t('register-as-recruiter')}</LinkText>
        </Link>
      )}
      {!isCrew && (
        <Link onPress={handleRegisterAsCrew}>
          <LinkText>{t('register-as-crew')}</LinkText>
        </Link>
      )}
    </VStack>
  )
}

export default LoginFormLinks
