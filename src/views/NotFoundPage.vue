<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const { isDark } = useTheme()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center px-4"
    :class="isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'"
  >
    <h1
      class="mb-2 text-6xl font-bold"
      style="color: #0f3d2e;"
    >
      404
    </h1>
    <p
      class="mb-6 text-lg"
      :class="isDark ? 'text-gray-300' : 'text-gray-700'"
    >
      Страница не найдена
    </p>
    <n-button type="primary" color="#0f3d2e" @click="goHome">
      На главную
    </n-button>
  </div>
</template>
