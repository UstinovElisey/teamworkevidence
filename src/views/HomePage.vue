<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NText, NSpace, NSpin } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'

const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { activeSection } = storeToRefs(uiStore)

const sectionTitle = computed(() => {
  const map: Record<string, string> = {
    home: t('nav.dashboard'),
    reports: t('nav.reports'),
    team: t('nav.team'),
    settings: t('nav.settings'),
  }
  return map[activeSection.value] || t('nav.dashboard')
})

const isHome = computed(() => activeSection.value === 'home')
</script>

<template>
  <div class="home-page">
    <h2 class="home-page__title">{{ sectionTitle }}</h2>

    <NSpin v-if="authStore.isLoading" size="large" />

    <!-- Dashboard: карточка с данными пользователя -->
    <NCard
      v-else-if="isHome && authStore.user"
      class="home-page__card"
      :bordered="true"
    >
      <NSpace vertical :size="8">
        <NText class="home-page__welcome">
          {{ t('common.welcome') }}, {{ authStore.user.email }}
        </NText>
        <NText depth="3" class="home-page__role">
          &#9654; {{ t('auth.role') }}: {{ t(`auth.roles.${authStore.user.role}`) }}
        </NText>
      </NSpace>
    </NCard>

    <!-- Заглушка для разделов в разработке -->
    <NCard
      v-else-if="!isHome"
      class="home-page__card home-page__card--placeholder"
      :bordered="true"
    >
      <div class="placeholder">
        <div class="placeholder__icon">&#9881;</div>
        <NText class="placeholder__title">
          {{ t('common.underDevelopment') }}
        </NText>
        <NText depth="3" class="placeholder__hint">
          {{ t('common.underDevelopmentHint') }}
        </NText>
      </div>
    </NCard>

    <NText v-else depth="3">
      {{ t('common.loading') }}
    </NText>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 720px;
}

.home-page__title {
  margin: 0 0 20px;
  font-size: 22px;
  font-weight: 600;
  color: var(--tw-text);
}

.home-page__card {
  background-color: var(--tw-bg-surface);
  border-color: var(--tw-border);
}

.home-page__welcome {
  font-size: 16px;
  font-weight: 500;
  color: var(--tw-primary);
}

.home-page__role {
  font-size: 14px;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
  text-align: center;
}

.placeholder__icon {
  font-size: 48px;
  color: var(--tw-text-muted);
  line-height: 1;
}

.placeholder__title {
  font-size: 16px;
  font-weight: 500;
  color: var(--tw-text);
}

.placeholder__hint {
  font-size: 13px;
  max-width: 360px;
}
</style>
