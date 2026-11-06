<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
  type FormRules,
  type FormInst,
} from 'naive-ui'
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const serverError = ref('')

const model = reactive({
  email: '',
  password: '',
})

const rules = computed<FormRules>(() => ({
  email: [
    { required: true, message: t('auth.validation.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.validation.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.validation.passwordRequired'), trigger: 'blur' },
    {
      min: 8,
      message: t('auth.validation.passwordMinLength', { min: 8 }),
      trigger: 'blur',
    },
  ],
}))

async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault()
  serverError.value = ''

  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  isSubmitting.value = true
  try {
    await authStore.login({ email: model.email, password: model.password })
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch (err: unknown) {
    console.warn('[LoginForm] login failed:', err)
    const axiosErr = err as { response?: { status?: number; data?: unknown } }
    const status = axiosErr.response?.status

    if (status === 401) {
      serverError.value = t('auth.errorInvalidCredentials')
    } else if (status && status >= 500) {
      serverError.value = t('auth.errorServerUnavailable')
    } else {
      serverError.value = t('auth.errorInvalidCredentials')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="top"
    require-mark-placement="right-hanging"
    @submit.prevent="handleSubmit"
  >
    <NAlert
      v-if="serverError"
      type="error"
      :title="serverError"
      closable
      style="margin-bottom: 16px"
      @close="serverError = ''"
    />

    <NFormItem :label="t('auth.email')" path="email">
      <NInput
        v-model:value="model.email"
        type="text"
        :placeholder="t('auth.emailPlaceholder')"
        :input-props="{ autocomplete: 'email' }"
      />
    </NFormItem>

    <NFormItem :label="t('auth.password')" path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="t('auth.passwordPlaceholder')"
        :input-props="{ autocomplete: 'current-password' }"
      />
    </NFormItem>

    <NButton
      type="primary"
      block
      :loading="isSubmitting"
      :disabled="isSubmitting"
      attr-type="submit"
      style="margin-top: 8px"
    >
      {{ t('auth.loginButton') }}
    </NButton>
  </NForm>
</template>
