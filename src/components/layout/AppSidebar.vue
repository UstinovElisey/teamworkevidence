<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { NLayoutSider, NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(RouterLink, { to: '/' }, { default: () => 'Дашборд' }),
    key: '/',
  },
  {
    label: () =>
      h(RouterLink, { to: '/teams' }, { default: () => 'Команды' }),
    key: '/teams',
  },
  {
    label: () =>
      h(RouterLink, { to: '/marketplace' }, { default: () => 'Маркетплейс' }),
    key: '/marketplace',
  },
  {
    label: () =>
      h(RouterLink, { to: '/hackathons' }, { default: () => 'Хакатоны' }),
    key: '/hackathons',
  },
  {
    label: () =>
      h(RouterLink, { to: '/profile' }, { default: () => 'Профиль' }),
    key: '/profile',
  },
]

const activeKey = computed(() => route.path)

const siderBg = computed(() => (isDark.value ? '#0d1117' : '#f6f8fa'))
const siderBorder = computed(() => (isDark.value ? '#30363d' : '#d0d7de'))

function goHome() {
  router.push('/')
}
</script>

<template>
  <n-layout-sider
    bordered
    :width="240"
    :native-scrollbar="false"
    :style="{
      backgroundColor: siderBg,
      borderRight: `1px solid ${siderBorder}`,
    }"
  >
    <div
      class="flex h-14 cursor-pointer items-center gap-2 px-4"
      :style="{ borderBottom: `1px solid ${siderBorder}` }"
      @click="goHome"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-white"
        style="background-color: #0f3d2e;"
      >
        TE
      </div>
      <span
        class="text-sm font-semibold"
        :class="isDark ? 'text-gray-100' : 'text-gray-900'"
      >
        TeamWorkEvidence
      </span>
    </div>

    <n-menu
      :value="activeKey"
      :options="menuOptions"
      :indent="18"
      :root-indent="18"
      class="pt-2"
    />
  </n-layout-sider>
</template>
