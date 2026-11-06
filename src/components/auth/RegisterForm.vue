<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  NAlert,
  NSpace,
} from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import { authApi } from '@/services/authApi'
import { tokenStorage } from '@/services/tokenStorage'
import type { UserRole } from '@/types/auth'

const { t } = useI18n()
const router = useRouter()

/* ---------- schema ---------- */
const registerSchema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .min(1, 'auth.validation.required')
        .email('auth.validation.invalidEmail'),
      password: z
        .string()
        .min(1, 'auth.validation.required')
        .min(8, 'auth.validation.minLength8'),
      confirmPassword: z
        .string()
        .min(1, 'auth.validation.required'),
      role: z.enum(['developer', 'employer', 'organizer', 'customer'], {
        required_error: 'auth.validation.required',
        invalid_type_error: 'auth.validation.required',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'auth.validation.passwordMismatch',
      path: ['confirmPassword'],
    }),
)

/* ---------- form ---------- */
const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    role: undefined as unknown as UserRole,
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')
const [role, roleAttrs] = defineField('role')

/* ---------- role options ---------- */
const roleOptions = computed<SelectOption[]>(() => [
  { label: t('auth.roles.developer'), value: 'developer' },
  { label: t('auth.roles.employer'), value: 'employer' },
  { label: t('auth.roles.organizer'), value: 'organizer' },
  { label: t('auth.roles.customer'), value: 'customer' },
])

/* ---------- state ---------- */
const serverError = ref('')

/* ---------- submit ---------- */
const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const response = await authApi.register({
      email: values.email,
      password: values.password,
      role: values.role,
    })
    tokenStorage.setAccessToken(response.access_token)
    tokenStorage.setRefreshToken(response.refresh_token)
    router.push('/')
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { error?: { code?: string } } }
    }
    const status = axiosErr?.response?.status
    const code = axiosErr?.response?.data?.error?.code

    if (status === 409 || code === 'USER_EXISTS') {
      serverError.value = t('auth.errorUserExists')
    } else {
      serverError.value = t('auth.errorGeneric')
    }
  }
})
</script>

<template>
  <NForm label-placement="top" @submit.prevent="onSubmit">
    <NFormItem
      :label="t('auth.email')"
      :validation-status="errors.email ? 'error' : undefined"
      :feedback="errors.email ? t(errors.email) : ''"
    >
      <NInput
        v-model:value="email"
        v-bind="emailAttrs"
        type="text"
        placeholder="email@example.com"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.password')"
      :validation-status="errors.password ? 'error' : undefined"
      :feedback="errors.password ? t(errors.password) : ''"
    >
      <NInput
        v-model:value="password"
        v-bind="passwordAttrs"
        type="password"
        show-password-on="click"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.confirmPassword')"
      :validation-status="errors.confirmPassword ? 'error' : undefined"
      :feedback="errors.confirmPassword ? t(errors.confirmPassword) : ''"
    >
      <NInput
        v-model:value="confirmPassword"
        v-bind="confirmPasswordAttrs"
        type="password"
        show-password-on="click"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.role')"
      :validation-status="errors.role ? 'error' : undefined"
      :feedback="errors.role ? t(errors.role) : ''"
    >
      <NSelect
        v-model:value="role"
        v-bind="roleAttrs"
        :options="roleOptions"
        :placeholder="t('auth.role')"
      />
    </NFormItem>

    <NAlert v-if="serverError" type="error" style="margin-bottom: 16px">
      {{ serverError }}
    </NAlert>

    <NButton type="primary" attr-type="submit" block :loading="isSubmitting">
      {{ t('auth.registerButton') }}
    </NButton>

    <NSpace justify="center" style="margin-top: 16px" :size="4">
      <span style="font-size: 14px; opacity: 0.7">{{ t('auth.hasAccount') }}</span>
      <RouterLink to="/login" style="color: var(--n-color-target, #2ea043); font-size: 14px; text-decoration: none">
        {{ t('auth.goToLogin') }} →
      </RouterLink>
    </NSpace>
  </NForm>
</template>
