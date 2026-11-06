<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
  NSpace,
  NSelect,
} from 'naive-ui'
import { AxiosError } from 'axios'
import { authApi } from '@/services/authApi'
import { tokenStorage } from '@/services/tokenStorage'
import type { AuthErrorPayload, UserRole } from '@/types/auth'

const { t } = useI18n()
const router = useRouter()

const serverError = ref('')
const isSubmitting = ref(false)

const roleOptions = computed(() => {
  const roles: UserRole[] = ['developer', 'employer', 'organizer', 'customer']
  return roles.map((r) => ({
    label: t(`auth.roles.${r}`),
    value: r,
  }))
})

const validationSchema = computed(() =>
  toTypedSchema(
    z
      .object({
        email: z
          .string()
          .min(1, t('auth.validation.required'))
          .email(t('auth.validation.invalidEmail')),
        password: z
          .string()
          .min(1, t('auth.validation.required'))
          .min(8, t('auth.validation.minLength8')),
        confirmPassword: z
          .string()
          .min(1, t('auth.validation.required')),
        role: z.enum(
          ['developer', 'employer', 'organizer', 'customer'] as const,
          { message: t('auth.validation.required') },
        ),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t('auth.validation.passwordMismatch'),
        path: ['confirmPassword'],
      }),
  ),
)

const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: role } = useField<string | null>('role')

function resolveServerError(code: string): string {
  const map: Record<string, string> = {
    USER_EXISTS: t('auth.errorUserExists'),
  }
  return map[code] || t('auth.errorGeneric')
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  isSubmitting.value = true

  try {
    const response = await authApi.register({
      email: values.email,
      password: values.password,
      role: values.role as UserRole,
    })

    tokenStorage.setAccessToken(response.access_token)
    tokenStorage.setRefreshToken(response.refresh_token)

    router.push('/')
  } catch (err: unknown) {
    console.error('[RegisterForm] Register error:', err)

    if (err instanceof AxiosError && err.response?.data) {
      const payload = err.response.data as AuthErrorPayload
      serverError.value = resolveServerError(payload.error?.code || '')
    } else if (err instanceof AxiosError) {
      serverError.value = err.message || t('auth.errorGeneric')
    } else {
      serverError.value = t('auth.errorGeneric')
    }
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <NForm class="register-form" @submit.prevent="onSubmit">
    <NFormItem
      :label="t('auth.email')"
      :validation-status="errors.email ? 'error' : undefined"
      :feedback="errors.email"
    >
      <NInput
        v-model:value="email"
        type="text"
        placeholder="email@example.com"
        size="large"
        :input-props="{ autocomplete: 'email' }"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.password')"
      :validation-status="errors.password ? 'error' : undefined"
      :feedback="errors.password"
    >
      <NInput
        v-model:value="password"
        type="password"
        show-password-on="click"
        size="large"
        :placeholder="t('auth.password')"
        :input-props="{ autocomplete: 'new-password' }"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.confirmPassword')"
      :validation-status="errors.confirmPassword ? 'error' : undefined"
      :feedback="errors.confirmPassword"
    >
      <NInput
        v-model:value="confirmPassword"
        type="password"
        show-password-on="click"
        size="large"
        :placeholder="t('auth.confirmPassword')"
        :input-props="{ autocomplete: 'new-password' }"
      />
    </NFormItem>

    <NFormItem
      :label="t('auth.role')"
      :validation-status="errors.role ? 'error' : undefined"
      :feedback="errors.role"
    >
      <NSelect
        v-model:value="role"
        :options="roleOptions"
        :placeholder="t('auth.role')"
        size="large"
      />
    </NFormItem>

    <NAlert
      v-if="serverError"
      type="error"
      :title="serverError"
      closable
      class="register-form__alert"
      @close="serverError = ''"
    />

    <NButton
      type="primary"
      attr-type="submit"
      block
      size="large"
      :loading="isSubmitting"
      :disabled="isSubmitting"
      class="register-form__submit"
    >
      {{ t('auth.registerButton') }}
    </NButton>

    <NSpace justify="center" class="register-form__footer">
      <span class="register-form__footer-text">{{ t('auth.hasAccount') }}</span>
      <router-link to="/login" class="register-form__link">
        {{ t('auth.goToLogin') }}
      </router-link>
    </NSpace>
  </NForm>
</template>

<style scoped>
.register-form {
  width: 100%;
}

.register-form__alert {
  margin-bottom: 16px;
}

.register-form__submit {
  margin-top: 8px;
  margin-bottom: 12px;
}

.register-form__footer {
  margin-top: 8px;
}

.register-form__footer-text {
  color: #8b949e;
  font-size: 14px;
}

.register-form__link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 14px;
}

.register-form__link:hover {
  text-decoration: underline;
}
</style>
