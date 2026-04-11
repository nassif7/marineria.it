import React, { useState, useRef, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { EyeIcon, EyeOffIcon } from 'lucide-react-native'
import { TUserRole } from '@/api/types'
import {
  Button,
  ButtonSpinner,
  ButtonText,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
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
  onOtpRequest?: (email: string) => void
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

const AuthenticationForm: FC<IAuthenticationForm> = ({
  authenticate,
  onOtpRequest,
  user,
  isLoading,
  onFocus,
  onBlur,
}) => {
  const { t } = useTranslation('login-screen')
  const hasOtpMode = !!onOtpRequest

  const [usePassword, setUsePassword] = useState(false)
  // Ref needed so onSubmit closure always reads the current mode
  const usePasswordRef = useRef(false)

  const isPasswordMode = !hasOtpMode || usePassword

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      email: user?.email ?? '',
      password: '',
    },
    onSubmit: ({ value }) => {
      if (usePasswordRef.current || !onOtpRequest) {
        authenticate(value)
      } else {
        onOtpRequest(value.email)
      }
    },
  })

  return (
    <VStack space="sm">
      {hasOtpMode && isPasswordMode && (
        <Text className="mb-1 text-sm text-typography-500">Enter your email and password to sign in.</Text>
      )}

      <Field
        name="email"
        validators={{
          onSubmit: ({ value }) => (!value || !EMAIL_PATTERN.test(value.trim()) ? t('invalid-email') : undefined),
        }}
      >
        {(field) => (
          <FormField
            name="email"
            value={field.state.value}
            placeholder={t('email')}
            onChangeText={(value) => field.handleChange(value.trim())}
            errors={field.state.meta.errors as string[]}
            autoCapitalize="none"
            onFocus={onFocus}
            onBlur={onBlur}
            helperText={
              !hasOtpMode
                ? t('email-helper-text')
                : !isPasswordMode
                  ? 'Enter your email to receive a login code.'
                  : undefined
            }
          />
        )}
      </Field>

      {isPasswordMode && (
        <Field
          name="password"
          validators={{
            onSubmit: ({ value }) => (!value ? t('invalid-password') : undefined),
          }}
        >
          {(field) => (
            <FormField
              name="password"
              value={field.state.value}
              placeholder={t('password')}
              onChangeText={field.handleChange}
              errors={field.state.meta.errors as string[]}
              type="password"
              onFocus={onFocus}
              onBlur={onBlur}
            />
          )}
        </Field>
      )}

      <Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => {
          const isBusy = isSubmitting || !!isLoading
          return (
            <>
              <Button onPress={handleSubmit} size="xl" isDisabled={!canSubmit || isBusy}>
                {isBusy && <ButtonSpinner color="white" />}
                <ButtonText className="text-white">{isPasswordMode ? t('login') : 'Continue'}</ButtonText>
              </Button>

              {hasOtpMode && (
                <Checkbox
                  size="sm"
                  className="mt-1"
                  value="usePassword"
                  isChecked={usePassword}
                  isDisabled={isBusy}
                  onChange={() => {
                    const next = !usePassword
                    setUsePassword(next)
                    usePasswordRef.current = next
                  }}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel>Use password instead</CheckboxLabel>
                </Checkbox>
              )}
            </>
          )
        }}
      </Subscribe>
    </VStack>
  )
}

export default AuthenticationForm

AuthenticationForm.displayName = 'AuthenticationForm'
