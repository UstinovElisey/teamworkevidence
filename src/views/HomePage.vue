<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <div class="page-placeholder">
    <h1>{{ t(route.meta.title as string) }}</h1>
    <p>{{ t('common.todo') }}</p>
  </div>
</template>

<style scoped>
.page-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--text-secondary);
}

.page-placeholder h1 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-placeholder p {
  font-size: 14px;
}
</style>
