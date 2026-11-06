<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NResult } from 'naive-ui'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <NResult
      status="404"
      :title="'404'"
      :description="t('common.notFound')"
    >
      <template #footer>
        <NButton
          type="primary"
          class="not-found__btn"
          @click="router.push('/')"
        >
          ← {{ t('common.backHome') }}
        </NButton>
      </template>
    </NResult>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found__btn {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
}

.not-found__btn:hover {
  background-color: var(--accent-hover) !important;
  border-color: var(--accent-hover) !important;
}
</style>
