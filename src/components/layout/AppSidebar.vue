<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const menuOptions = computed<MenuOption[]>(() => [
  {
    label: t('nav.dashboard'),
    key: '/',
  },
  {
    label: t('nav.profile'),
    key: '/profile',
  },
  {
    label: t('nav.teams'),
    key: '/teams',
  },
  {
    label: t('nav.marketplace'),
    key: '/marketplace',
  },
  {
    label: t('nav.hackathons'),
    key: '/hackathons',
  },
])

const activeKey = computed(() => route.path)

function handleMenuSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <aside class="app-sidebar">
    <NMenu :options="menuOptions" :value="activeKey" @update:value="handleMenuSelect" />
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 220px;
  height: 100%;
  padding: 12px 0;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  flex-shrink: 0;
}
</style>
