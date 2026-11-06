<script setup lang="ts">
import { ref } from 'vue'
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
  NAlert,
  NSpace,
} from 'naive-ui'
import { authApi } from '@/services/authApi'
import { tokenStorage } from '@/services/tokenStorage'

const { t } = useI18n()
const router = useRouter()

/* ---------- schema ---------- */
const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'auth.validation.required')
      .email('auth.validation.invalidEmail'),
    password: z
      .string()
      .min(1, 'auth.validation.required')
      .min(8, 'auth.validation.minLength8'),
  }),
)

/* ---------- form ---------- */
const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

/* ---------- state ---------- */
const serverError = ref('')

/* ---------- submit ---------- */
const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    const response = await authApi.login({
      email: values.email,
      password: values.password,
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

    if (status === 401 || code === 'INVALID_CREDENTIALS') {
      serverError.value = t('auth.errorInvalidCredentials')
    } else if (status === 404 || code === 'USER_NOT_FOUND') {
      serverError.value = t('auth.errorUserNotFound')
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

    <NAlert v-if="serverError" type="error" style="margin-bottom: 16px">
      {{ serverError }}
    </NAlert>

    <NButton type="primary" attr-type="submit" block :loading="isSubmitting">
      {{ t('auth.loginButton') }}
    </NButton>

    <NSpace justify="center" style="margin-top: 16px" :size="4">
      <span style="font-size: 14px; opacity: 0.7">{{ t('auth.noAccount') }}</span>
      <RouterLink to="/register" style="color: var(--n-color-target, #2ea043); font-size: 14px; text-decoration: none">
        {{ t('auth.goToRegister') }} →
      </RouterLink>
    </NSpace>

    <NButton block quaternary disabled style="margin-top: 12px">
      ◯ {{ t('auth.oauthGithub') }}
    </NButton>
  </NForm>
</template>
