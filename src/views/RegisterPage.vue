<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NCard } from 'naive-ui'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const { t } = useI18n()
</script>

<template>
  <div class="register-page">
    <div class="register-page__logo">
      <span class="register-page__logo-icon">&#9881;</span>
    </div>
    <NCard
      :title="t('auth.register')"
      class="register-page__card"
      :bordered="true"
      size="large"
    >
      <RegisterForm />
    </NCard>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px 16px;
}

.register-page__logo {
  margin-bottom: 24px;
}

.register-page__logo-icon {
  font-size: 48px;
  color: #238636;
}

.register-page__card {
  width: 100%;
  max-width: 440px;
  background-color: #0d1117;
  border-color: #30363d;
}

.register-page__card :deep(.n-card-header) {
  text-align: center;
}

.register-page__card :deep(.n-card-header__main) {
  color: #f0f6fc;
  font-size: 24px;
  font-weight: 600;
}
</style>
