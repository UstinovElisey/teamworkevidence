<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { NButton } from 'naive-ui'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center px-4"
    :class="isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'"
  >
    <div class="mb-8 flex items-center gap-2">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-md font-bold text-white"
        style="background-color: #0f3d2e"
      >
        TE
      </div>
      <span class="text-lg font-semibold" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
        TeamWorkEvidence
      </span>
    </div>

    <div
      class="w-full max-w-md rounded-lg border p-8"
      :class="isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'"
    >
      <router-view />
    </div>

    <div class="mt-6">
      <n-button text size="small" @click="toggleTheme">
        {{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
      </n-button>
    </div>
  </div>
</template>
