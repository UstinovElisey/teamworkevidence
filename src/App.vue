<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  type GlobalThemeOverrides,
} from 'naive-ui'
import { useTheme } from '@/composables/useTheme'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const { isDark } = useTheme()

const currentLayout = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : MainLayout
})

/* ── Тёмная палитра (GitHub Dark) ── */
const darkOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#238636',
    primaryColorHover: '#2ea043',
    primaryColorPressed: '#1a7f37',
    primaryColorSuppl: '#238636',
    bodyColor: '#0d1117',
    cardColor: '#161b22',
    modalColor: '#161b22',
    popoverColor: '#161b22',
    inputColor: '#0d1117',
    tableColor: '#161b22',
    borderColor: '#30363d',
    textColorBase: '#c9d1d9',
    textColor1: '#c9d1d9',
    textColor2: '#c9d1d9',
    textColor3: '#8b949e',
  },
}

/* ── Светлая палитра (GitHub Light) ── */
const lightOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1a7f37',
    primaryColorHover: '#238636',
    primaryColorPressed: '#116329',
    primaryColorSuppl: '#1a7f37',
    bodyColor: '#ffffff',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    inputColor: '#ffffff',
    tableColor: '#ffffff',
    borderColor: '#d0d7de',
    textColorBase: '#1f2328',
    textColor1: '#1f2328',
    textColor2: '#1f2328',
    textColor3: '#656d76',
  },
}

/* ── Экспорт CSS-переменных в :root для кастомных стилей ── */
watchEffect(() => {
  const root = document.documentElement
  if (isDark.value) {
    root.style.setProperty('--tw-bg-base', '#0d1117')
    root.style.setProperty('--tw-bg-surface', '#161b22')
    root.style.setProperty('--tw-bg-elevated', '#1c2128')
    root.style.setProperty('--tw-border', '#30363d')
    root.style.setProperty('--tw-text', '#c9d1d9')
    root.style.setProperty('--tw-text-muted', '#8b949e')
    root.style.setProperty('--tw-primary', '#2ea043')
    root.style.setProperty('--tw-primary-hover', '#3fb950')
    root.style.setProperty('--tw-danger', '#f85149')
    root.style.setProperty('--tw-danger-hover', '#ff7b72')
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.style.setProperty('--tw-bg-base', '#ffffff')
    root.style.setProperty('--tw-bg-surface', '#f6f8fa')
    root.style.setProperty('--tw-bg-elevated', '#ffffff')
    root.style.setProperty('--tw-border', '#d0d7de')
    root.style.setProperty('--tw-text', '#1f2328')
    root.style.setProperty('--tw-text-muted', '#656d76')
    root.style.setProperty('--tw-primary', '#1a7f37')
    root.style.setProperty('--tw-primary-hover', '#238636')
    root.style.setProperty('--tw-danger', '#cf222e')
    root.style.setProperty('--tw-danger-hover', '#a40e26')
    root.classList.add('light')
    root.classList.remove('dark')
  }
})
</script>

<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="isDark ? darkOverrides : lightOverrides"
  >
    <NMessageProvider>
      <component :is="currentLayout">
        <RouterView />
      </component>
    </NMessageProvider>
  </NConfigProvider>
</template>
