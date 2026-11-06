<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="main-layout">
    <AppHeader />
    <div class="main-layout__body">
      <AppSidebar />
      <main class="main-layout__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-layout__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-layout__content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background-color: var(--bg-main);
}

@media (max-width: 767px) {
  .main-layout__body {
    overflow-y: auto;
  }

  .main-layout__body :deep(.app-sidebar) {
    display: none;
  }

  .main-layout__content {
    overflow: visible;
    padding: 8px;
  }
}
</style>
