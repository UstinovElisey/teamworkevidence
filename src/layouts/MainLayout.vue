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
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--tw-bg-base);
}

.main-layout__body {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
}

.main-layout__content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background-color: var(--tw-bg-base);
  position: relative;
  z-index: 0;
}
</style>
