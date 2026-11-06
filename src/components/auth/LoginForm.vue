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
  NIcon,
} from 'naive-ui'
import { AxiosError } from 'axios'
import { authApi } from '@/services/authApi'
import { tokenStorage } from '@/services/tokenStorage'
import type { AuthErrorPayload } from '@/types/auth'

const { t } = useI18n()
const router = useRouter()

const serverError = ref('')
const isSubmitting = ref(false)

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      email: z
        .string()
        .min(1, t('auth.validation.required'))
        .email(t('auth.validation.invalidEmail')),
      password: z
        .string()
        .min(1, t('auth.validation.required'))
        .min(8, t('auth.validation.minLength8')),
    }),
  ),
)

const { handleSubmit, errors } = useForm({
  validationSchema,
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

function resolveServerError(code: string): string {
  const map: Record<string, string> = {
    INVALID_CREDENTIALS: t('auth.errorInvalidCredentials'),
    USER_NOT_FOUND: t('auth.errorUserNotFound'),
  }
  return map[code] || t('auth.errorGeneric')
}

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  isSubmitting.value = true

  try {
    const response = await authApi.login({
      email: values.email,
      password: values.password,
    })

    tokenStorage.setAccessToken(response.access_token)
    tokenStorage.setRefreshToken(response.refresh_token)

    router.push('/')
  } catch (err: unknown) {
    console.error('[LoginForm] Login error:', err)

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
  <NForm class="login-form" @submit.prevent="onSubmit">
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
        :input-props="{ autocomplete: 'current-password' }"
      />
    </NFormItem>

    <NAlert
      v-if="serverError"
      type="error"
      :title="serverError"
      closable
      class="login-form__alert"
      @close="serverError = ''"
    />

    <NButton
      type="primary"
      attr-type="submit"
      block
      size="large"
      :loading="isSubmitting"
      :disabled="isSubmitting"
      class="login-form__submit"
    >
      {{ t('auth.loginButton') }}
    </NButton>

    <NButton
      block
      quaternary
      size="large"
      disabled
      class="login-form__github"
    >
      <template #icon>
        <NIcon size="20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </NIcon>
      </template>
      {{ t('auth.oauthGithub') }}
    </NButton>

    <NSpace justify="center" class="login-form__footer">
      <span class="login-form__footer-text">{{ t('auth.noAccount') }}</span>
      <router-link to="/register" class="login-form__link">
        {{ t('auth.goToRegister') }}
      </router-link>
    </NSpace>
  </NForm>
</template>

<style scoped>
.login-form {
  width: 100%;
}

.login-form__alert {
  margin-bottom: 16px;
}

.login-form__submit {
  margin-top: 8px;
  margin-bottom: 12px;
}

.login-form__github {
  margin-bottom: 16px;
}

.login-form__footer {
  margin-top: 8px;
}

.login-form__footer-text {
  color: #8b949e;
  font-size: 14px;
}

.login-form__link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 14px;
}

.login-form__link:hover {
  text-decoration: underline;
}
</style>
