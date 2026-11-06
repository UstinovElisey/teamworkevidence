<script setup lang="ts">
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
} from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, naiveTheme } = useTheme()
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <n-global-style />
    <n-message-provider>
      <n-notification-provider>
        <div
          class="flex min-h-screen flex-col items-center justify-center gap-4"
        >
          <h1 class="text-3xl font-bold">TeamWorkEvidence</h1>

          <!-- Временная кнопка — будет удалена в задаче 3 -->
          <button
            class="rounded-md bg-brand-500 px-4 py-2 text-white transition-colors hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-300"
            @click="toggleTheme"
          >
            {{ isDark ? '☀️ Light' : '🌙 Dark' }}
          </button>
        </div>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>
