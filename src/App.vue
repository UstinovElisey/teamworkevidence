<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { isDark, theme } = useTheme()
</script>

<template>
  <NConfigProvider :theme="theme">
    <div :class="isDark ? 'theme-dark' : 'theme-light'" class="app-root">
      <RouterView />
    </div>
  </NConfigProvider>
</template>

<style>
/* ── Глобальные CSS-переменные ── */

.theme-dark {
  --bg-header: #161b22;
  --bg-sidebar: #0d1117;
  --bg-main: #0d1117;
  --bg-page: #0d1117;
  --border-color: #30363d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-muted: #484f58;
  --accent: #2ea043;
  --accent-hover: #3fb950;
  --menu-active-bg: #1f2937;
  --menu-hover-bg: #161b22;
}

.theme-light {
  --bg-header: #ffffff;
  --bg-sidebar: #f6f8fa;
  --bg-main: #ffffff;
  --bg-page: #ffffff;
  --border-color: #d0d7de;
  --text-primary: #1f2328;
  --text-secondary: #656d76;
  --text-muted: #8b949e;
  --accent: #1a7f37;
  --accent-hover: #238636;
  --menu-active-bg: #eaeef2;
  --menu-hover-bg: #f3f4f6;
}

/* ── Сброс ── */

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
  background-color: var(--bg-page);
  color: var(--text-primary);
}

.app-root {
  height: 100%;
}
</style>
