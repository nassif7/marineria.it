import React, { useState, FC } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Link,
  LinkText,
  VStack,
  View,
  Divider,
} from '@/components/ui'
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { AuthTypes } from '@/api/types'

const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FormDate = {
  email: string
  password: string
}
type SwitchUserRole = {
  email: string
  role: AuthTypes.UserRole
}

interface AuthenticationFormProps {
  authenticate: (args: FormDate) => Promise<any>
  user?: SwitchUserRole
}

const AuthenticationForm: FC<AuthenticationFormProps> = ({ authenticate, user }) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      email: user ? user.email : '',
      password: '',
    },
    onSubmit: ({ value }) => handleAuthentication(value),
  })

  const handleAuthentication: (data: FormDate) => Promise<any> = async ({ email, password }) => {
    await authenticate({ email, password })
  }

  return (
    <View className="rounded bg-secondary-200 py-4 px-4">
      <VStack>
        <Field
          name="email"
          validators={{
            onSubmit: ({ value }) => {
              const isInvalidEmail = value
                ? pattern.test(value)
                  ? undefined
                  : 'provide a valid email'
                : 'enter an email'

              return isInvalidEmail
            },
          }}
        >
          {(field) => {
            return (
              <FormControl isRequired isInvalid={!!field.state.meta.errors.length} className="mb-2">
                <Input size="xl" isInvalid={!!field.state.meta.errors.length} isRequired>
                  <InputField
                    className=" bg-white"
                    placeholder="Email"
                    type="text"
                    onChangeText={field.handleChange}
                    value={field.state.value}
                    autoCapitalize="none"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{field.state.meta.errors?.[0]}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            )
          }}
        </Field>
        <Field
          name="password"
          validators={{
            onSubmit: ({ value }) => {
              const isInvalidPassword = value ? undefined : 'please enter your password'

              return isInvalidPassword
            },
          }}
        >
          {(field) => {
            return (
              <FormControl size="lg" isRequired isInvalid={!!field.state.meta.errors.length} className="mb-2">
                <Input size="xl" className="bg-white" isInvalid={!!field.state.meta.errors.length} isRequired>
                  <InputField
                    className=" bg-white"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    onChangeText={field.handleChange}
                    value={field.state.value}
                  />
                  <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
                <FormControlError>
                  <FormControlErrorText>{field.state.meta.errors?.[0]}</FormControlErrorText>
                </FormControlError>
              </FormControl>
            )
          }}
        </Field>
        <Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button onPress={handleSubmit} size="xl" disabled={!canSubmit || isSubmitting}>
              {isSubmitting && <ButtonSpinner color={'white'} />}
              <ButtonText className="text-white">{t('login')}</ButtonText>
            </Button>
          )}
        />
      </VStack>
      <Divider className="my-4 bg-secondary-800" />
      <VStack>
        <Link href="https://www.marineria.it/En/Forgot_PSW.aspx" className="mb-1">
          <LinkText className="text-left">{t('forgot-password')}</LinkText>
        </Link>
        {(!user || user?.role == AuthTypes.UserRole.PRO) && (
          <Link href="https://www.marineria.it/En/Rec/Reg.aspx" className="mb-1">
            <LinkText>{t('register-as-recruiter')}</LinkText>
          </Link>
        )}
        {(!user || user?.role == AuthTypes.UserRole.OWNER) && (
          <Link href="https://www.marineria.it/En/Pro/Reg.aspx">
            <LinkText>{t('register-as-crew')}</LinkText>
          </Link>
        )}
      </VStack>
    </View>
  )
}

export default AuthenticationForm
