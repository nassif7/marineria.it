import React, { useState, FC } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'
import { TUserRole } from '@/api/types'
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FormDate = {
  email: string
  password: string
}

type SwitchUserRole = {
  email: string
  role: TUserRole
}

interface IAuthenticationForm {
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
  helperText?: string
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
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const isInvalid = !!errors.length

  return (
    <FormControl isRequired isInvalid={isInvalid}>
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
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorText>{errors?.[0]}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}

const AuthenticationForm: FC<IAuthenticationForm> = ({ authenticate, user, isLoading, onFocus, onBlur }) => {
  const { t } = useTranslation('login-screen')

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
    helperText?: string
  }[] = [
    {
      name: 'email',
      placeholder: t('email'),
      autoCapitalize: 'none',
      validate: (value) => (!value || !EMAIL_PATTERN.test(value) ? t('invalid-email') : undefined),
      helperText: t('email-helper-text'),
    },
    {
      name: 'password',
      placeholder: t('password'),
      type: 'password',
      validate: (value) => (!value ? t('invalid-password') : undefined),
    },
  ]

  return (
    <KeyboardAvoidingView className="w-full" behavior="padding">
      <VStack space="sm">
        {fields.map(({ name, placeholder, type, autoCapitalize, validate, helperText }) => (
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
                helperText={helperText}
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
    </KeyboardAvoidingView>
  )
}

export default AuthenticationForm
