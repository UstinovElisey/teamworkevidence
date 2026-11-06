<script setup lang="ts">
import { computed } from 'vue'
import { NLayoutHeader, NButton, NDropdown, NAvatar } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const userMenuOptions = [
  { label: 'Профиль', key: 'profile' },
  { label: 'Настройки', key: 'settings' },
  { type: 'divider', key: 'd1' },
  { label: 'Выйти', key: 'logout' },
]

const headerBg = computed(() => (isDark.value ? '#161b22' : '#ffffff'))
const headerBorder = computed(() => (isDark.value ? '#30363d' : '#d0d7de'))
</script>

<template>
  <n-layout-header
    bordered
    :style="{
      backgroundColor: headerBg,
      borderBottom: `1px solid ${headerBorder}`,
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }"
  >
    <div class="flex items-center gap-3">
      <span
        class="text-sm font-medium"
        :class="isDark ? 'text-gray-300' : 'text-gray-700'"
      >
        Главная панель
      </span>
    </div>

    <div class="flex items-center gap-2">
      <n-button text size="small" @click="toggleTheme">
        {{ isDark ? 'Светлая' : 'Тёмная' }}
      </n-button>

      <!-- Заглушка для языка (задача 5) -->
      <n-button text size="small" disabled>
        RU
      </n-button>

      <n-dropdown :options="userMenuOptions" trigger="click">
        <n-avatar
          round
          size="small"
          :style="{ backgroundColor: '#0f3d2e', cursor: 'pointer' }"
        >
          U
        </n-avatar>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>
