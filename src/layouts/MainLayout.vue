<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <n-layout has-sider class="min-h-screen">
    <app-sidebar />
    <n-layout>
      <app-header />
      <n-layout-content content-style="padding: 24px;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
