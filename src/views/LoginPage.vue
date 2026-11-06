<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NCard } from 'naive-ui'
import LoginForm from '@/components/auth/LoginForm.vue'

const { t } = useI18n()
</script>

<template>
  <div class="login-page">
    <div class="login-page__logo">
      <span class="login-page__logo-icon">&#9881;</span>
    </div>
    <NCard
      :title="t('auth.login')"
      class="login-page__card"
      :bordered="true"
      size="large"
    >
      <LoginForm />
    </NCard>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px 16px;
}

.login-page__logo {
  margin-bottom: 24px;
}

.login-page__logo-icon {
  font-size: 48px;
  color: #238636;
}

.login-page__card {
  width: 100%;
  max-width: 400px;
  background-color: #0d1117;
  border-color: #30363d;
}

.login-page__card :deep(.n-card-header) {
  text-align: center;
}

.login-page__card :deep(.n-card-header__main) {
  color: #f0f6fc;
  font-size: 24px;
  font-weight: 600;
}
</style>
