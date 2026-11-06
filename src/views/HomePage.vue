<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
const { isDark } = useTheme()
</script>

<template>
  <div>
    <h1
      class="mb-2 text-2xl font-semibold"
      :class="isDark ? 'text-gray-100' : 'text-gray-900'"
    >
      Дашборд
    </h1>
    <p :class="isDark ? 'text-gray-400' : 'text-gray-600'">
      Добро пожаловать в TeamWorkEvidence.
    </p>
  </div>
</template>
