<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NAlert,
  NSelect,
  type FormRules,
  type FormInst,
} from 'naive-ui'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const serverError = ref('')

const model = reactive({
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'developer' as UserRole,
})

const roleOptions = computed(() => [
  { label: t('auth.roles.developer'), value: 'developer' },
  { label: t('auth.roles.teamlead'), value: 'teamlead' },
  { label: t('auth.roles.manager'), value: 'manager' },
  { label: t('auth.roles.admin'), value: 'admin' },
])

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
  passwordConfirmation: [
    {
      required: true,
      message: t('auth.validation.passwordConfirmRequired'),
      trigger: 'blur',
    },
    {
      validator(_rule: unknown, value: string) {
        if (value !== model.password) {
          return new Error(t('auth.validation.passwordsMismatch'))
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  role: [
    { required: true, message: t('auth.validation.roleRequired'), trigger: 'change' },
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
    await authStore.register({
      email: model.email,
      password: model.password,
      password_confirmation: model.passwordConfirmation,
      role: model.role,
    })
    await router.push('/')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number } }
    if (axiosErr.response?.status === 409) {
      serverError.value = t('auth.errorEmailTaken')
    } else {
      serverError.value = t('auth.errorRegisterFailed')
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
        :input-props="{ autocomplete: 'new-password' }"
      />
    </NFormItem>

    <NFormItem :label="t('auth.passwordConfirm')" path="passwordConfirmation">
      <NInput
        v-model:value="model.passwordConfirmation"
        type="password"
        show-password-on="click"
        :placeholder="t('auth.passwordConfirmPlaceholder')"
        :input-props="{ autocomplete: 'new-password' }"
      />
    </NFormItem>

    <NFormItem :label="t('auth.role')" path="role">
      <NSelect v-model:value="model.role" :options="roleOptions" />
    </NFormItem>

    <NButton
      type="primary"
      block
      :loading="isSubmitting"
      :disabled="isSubmitting"
      attr-type="submit"
      style="margin-top: 8px"
    >
      {{ t('auth.registerButton') }}
    </NButton>
  </NForm>
</template>
