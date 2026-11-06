<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NText } from 'naive-ui'

const { t } = useI18n()
</script>

<template>
  <div class="not-found">
    <NText class="not-found__code">404</NText>
    <NText depth="3" class="not-found__message">
      {{ t('errors.notFound') }}
    </NText>
    <RouterLink to="/">
      <NButton type="primary" size="medium" style="margin-top: 16px">
        &#8592; {{ t('nav.dashboard') }}
      </NButton>
    </RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
}

.not-found__code {
  font-size: 64px;
  font-weight: 700;
  color: var(--tw-border);
}

.not-found__message {
  font-size: 18px;
  color: var(--tw-text);
}
</style>
