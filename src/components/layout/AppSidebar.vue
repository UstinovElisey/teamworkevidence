<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NMenu, type MenuOption } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'

const { t } = useI18n()
const router = useRouter()
const uiStore = useUiStore()
const { activeSection } = storeToRefs(uiStore)

const menuOptions = computed<MenuOption[]>(() => [
  { label: t('nav.dashboard'), key: 'home' },
  { label: t('nav.reports'), key: 'reports' },
  { label: t('nav.team'), key: 'team' },
  { label: t('nav.settings'), key: 'settings' },
])

function handleSelect(key: string): void {
  console.log('[Sidebar] click key =', key)
  uiStore.setActiveSection(key)

  /* Для реализованных разделов — реальный переход на роут */
  if (key === 'home') {
    router.push({ name: 'home' })
  }
  /* Для остальных контент меняет HomePage через uiStore.activeSection */
}
</script>

<template>
  <aside class="app-sidebar">
    <NMenu
      :options="menuOptions"
      :value="activeSection"
      :indent="18"
      @update:value="handleSelect"
    />
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 12px 0;
  background-color: var(--tw-bg-surface);
  border-right: 1px solid var(--tw-border);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
</style>
