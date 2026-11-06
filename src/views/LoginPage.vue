<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <div>
    <h2 class="mb-1 text-xl font-semibold" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
      Вход в аккаунт
    </h2>
    <p class="mb-6 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
      TODO: форма логина (задача 6)
    </p>
    <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
      Нет аккаунта?
      <router-link to="/register" class="font-medium" style="color: #0f3d2e">
        Зарегистрироваться
      </router-link>
    </p>
  </div>
</template>
