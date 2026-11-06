<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NCard, NText } from 'naive-ui'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const { t } = useI18n()
</script>

<template>
  <NCard class="auth-card" :bordered="true">
    <template #header>
      <div class="auth-card__header">
        <span class="auth-card__icon">&#9670;</span>
        {{ t('auth.registerTitle') }}
      </div>
    </template>

    <RegisterForm />

    <template #footer>
      <NText depth="3" class="auth-card__footer">
        {{ t('auth.hasAccount') }}
        <RouterLink to="/login" class="auth-card__link">
          {{ t('auth.goToLogin') }}
        </RouterLink>
      </NText>
    </template>
  </NCard>
</template>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--tw-bg-surface);
  border-color: var(--tw-border);
}

.auth-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--tw-text);
}

.auth-card__icon {
  color: var(--tw-primary);
  font-size: 22px;
}

.auth-card__footer {
  text-align: center;
  display: block;
  font-size: 13px;
}

.auth-card__link {
  color: var(--tw-primary);
  text-decoration: none;
  margin-left: 4px;
}

.auth-card__link:hover {
  text-decoration: underline;
  color: var(--tw-primary-hover);
}
</style>
