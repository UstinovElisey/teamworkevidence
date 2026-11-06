<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const theme = computed(() => (isDark.value ? darkTheme : null))

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#0f3d2e',
    primaryColorHover: '#145239',
    primaryColorPressed: '#0a2e21',
    primaryColorSuppl: '#145239',
  },
}))
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
