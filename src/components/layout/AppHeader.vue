<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDropdown, NButton, NSpace } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'
import type { SupportedLocale } from '@/i18n'
import { SUPPORTED_LOCALES } from '@/i18n'

const { t, locale } = useI18n()
const { isDark, toggleTheme } = useTheme()

const currentLocaleLabel = computed(() => locale.value.toUpperCase())

const languageOptions = computed<DropdownOption[]>(() =>
  SUPPORTED_LOCALES.map((lang) => ({
    label: t(`language.${lang}`),
    key: lang,
  })),
)

function handleLocaleSelect(key: string) {
  const lang = key as SupportedLocale
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const themeIcon = computed(() => (isDark.value ? '☀' : '☾'))
const themeLabel = computed(() =>
  isDark.value ? t('theme.light') : t('theme.dark'),
)
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <span class="app-header__logo">◆</span>
      <span class="app-header__title">{{ t('app.name') }}</span>
    </div>

    <div class="app-header__right">
      <NSpace :size="8" align="center">
        <NDropdown
          :options="languageOptions"
          :value="locale"
          trigger="click"
          @select="handleLocaleSelect"
        >
          <NButton
            quaternary
            size="small"
            class="header-btn"
            :title="t('language.switch')"
          >
            <span class="header-btn__icon">⊕</span>
            <span class="header-btn__label">{{ currentLocaleLabel }}</span>
          </NButton>
        </NDropdown>

        <NButton
          quaternary
          size="small"
          class="header-btn"
          :title="themeLabel"
          @click="toggleTheme"
        >
          <span class="header-btn__icon">{{ themeIcon }}</span>
        </NButton>
      </NSpace>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-header__logo {
  font-size: 20px;
  color: var(--accent);
  line-height: 1;
}

.app-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.app-header__right {
  display: flex;
  align-items: center;
}

.header-btn {
  color: var(--text-secondary) !important;
  transition: color 0.15s ease;
}

.header-btn:hover {
  color: var(--text-primary) !important;
}

.header-btn__icon {
  font-size: 15px;
  line-height: 1;
  margin-right: 4px;
}

.header-btn__label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>
