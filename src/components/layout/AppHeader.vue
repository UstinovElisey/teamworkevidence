<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NSpace, NText } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/authStore'

const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const authStore = useAuthStore()

const currentLocaleLabel = computed(() => (locale.value === 'ru' ? 'EN' : 'RU'))

function toggleLocale(): void {
  locale.value = locale.value === 'ru' ? 'en' : 'ru'
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <span class="app-header__logo">&#9670;</span>
      <span class="app-header__title">{{ t('app.name') }}</span>
    </div>

    <NSpace align="center" :size="12">
      <NText
        v-if="authStore.isAuthenticated && authStore.user"
        class="app-header__user"
        depth="2"
      >
        &#9673; {{ authStore.user.email }}
      </NText>

      <NButton quaternary size="small" @click="toggleLocale">
        {{ currentLocaleLabel }}
      </NButton>

      <NButton quaternary size="small" @click="toggleTheme">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </NButton>

      <NButton
        v-if="authStore.isAuthenticated"
        quaternary
        size="small"
        class="app-header__btn--logout"
        @click="handleLogout"
      >
        &#10140; {{ t('auth.logout') }}
      </NButton>
    </NSpace>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background-color: var(--tw-bg-surface);
  border-bottom: 1px solid var(--tw-border);
  flex-shrink: 0;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: var(--tw-text);
}

.app-header__logo {
  color: var(--tw-primary);
  font-size: 20px;
}

.app-header__title {
  color: var(--tw-text);
}

.app-header__user {
  font-size: 13px;
  color: var(--tw-text-muted);
}

.app-header__btn--logout {
  color: var(--tw-danger) !important;
}

.app-header__btn--logout:hover {
  color: var(--tw-danger-hover) !important;
}
</style>
