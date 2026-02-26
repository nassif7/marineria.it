import React, { useState, FC } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { useForm, FieldComponent } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'
import {
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
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
import { AuthTypes } from '@/api/types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FormDate = {
  email: string
  password: string
}

type SwitchUserRole = {
  email: string
  role: AuthTypes.UserRole
}

interface AuthenticationFormProps {
  authenticate: (args: FormDate) => void
  user?: SwitchUserRole
  isLoading?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

// --- FormField Component ---

type FormFieldProps = {
  name: string
  value: string
  placeholder: string
  onChangeText: (value: string) => void
  errors: string[]
  onFocus?: () => void
  onBlur?: () => void
  type?: 'text' | 'password'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

const FormField: FC<FormFieldProps> = ({
  value,
  placeholder,
  onChangeText,
  errors,
  onFocus,
  onBlur,
  type = 'text',
  autoCapitalize = 'sentences',
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const isInvalid = !!errors.length

  return (
    <FormControl isRequired isInvalid={isInvalid} className="mb-2">
      <Input size="xl" className="bg-white" isInvalid={isInvalid} isRequired>
        <InputField
          className="bg-white"
          placeholder={placeholder}
          type={isPassword && !showPassword ? 'password' : 'text'}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {isPassword && (
          <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
          </InputSlot>
        )}
      </Input>
      <FormControlHelper>
        <FormControlHelperText />
      </FormControlHelper>
      <FormControlError>
        <FormControlErrorText>{errors?.[0]}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}

// --- AuthenticationForm ---

const AuthenticationForm: FC<AuthenticationFormProps> = ({ authenticate, user, isLoading, onFocus, onBlur }) => {
  const { t } = useTranslation()

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      email: user?.email ?? '',
      password: '',
    },
    onSubmit: ({ value }) => authenticate(value),
  })

  const fields: {
    name: keyof FormDate
    placeholder: string
    type?: 'text' | 'password'
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    validate: (value: string) => string | undefined
  }[] = [
    {
      name: 'email',
      placeholder: t('login-screen.form.email'),
      autoCapitalize: 'none',
      validate: (value) => (!value || !EMAIL_PATTERN.test(value) ? t('login-screen.form.invalid-email') : undefined),
    },
    {
      name: 'password',
      placeholder: t('login-screen.form.password'),
      type: 'password',
      validate: (value) => (!value ? t('login-screen.form.invalid-password') : undefined),
    },
  ]

  return (
    <KeyboardAvoidingView className="w-11/12" behavior="padding">
      <View className="rounded bg-secondary-200 py-4 px-4">
        <VStack>
          {fields.map(({ name, placeholder, type, autoCapitalize, validate }) => (
            <Field key={name} name={name} validators={{ onSubmit: ({ value }) => validate(value) }}>
              {(field) => (
                <FormField
                  name={name}
                  value={field.state.value}
                  placeholder={placeholder}
                  onChangeText={field.handleChange}
                  errors={field.state.meta.errors as string[]}
                  type={type}
                  autoCapitalize={autoCapitalize}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              )}
            </Field>
          ))}

          <Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button onPress={handleSubmit} size="xl" isDisabled={!canSubmit || isSubmitting || isLoading}>
                {(isSubmitting || isLoading) && <ButtonSpinner color="white" />}
                <ButtonText className="text-white">{t('login')}</ButtonText>
              </Button>
            )}
          </Subscribe>
        </VStack>

        <Divider className="my-4 bg-secondary-800" />

        <VStack>
          <Link href="https://www.marineria.it/En/Forgot_PSW.aspx" className="mb-1">
            <LinkText className="text-left">{t('forgot-password')}</LinkText>
          </Link>
          {(!user || user.role === AuthTypes.UserRole.CREW) && (
            <Link href="https://www.marineria.it/En/Rec/Reg.aspx" className="mb-1">
              <LinkText>{t('register-as-recruiter')}</LinkText>
            </Link>
          )}
          {(!user || user.role === AuthTypes.UserRole.RECRUITER) && (
            <Link href="https://www.marineria.it/En/Pro/Reg.aspx">
              <LinkText>{t('register-as-crew')}</LinkText>
            </Link>
          )}
        </VStack>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AuthenticationForm
