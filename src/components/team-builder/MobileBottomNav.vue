<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { label: 'Главная', icon: '⌂', path: '/' },
  { label: 'Команда', icon: '◉', path: '/teams' },
  { label: 'Рынок', icon: '◇', path: '/marketplace' },
  { label: 'Профиль', icon: '◌', path: '/profile' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <nav class="mobile-bottom-nav" aria-label="Основная навигация">
    <RouterLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      :class="{ 'is-active': activePath === item.path }"
    >
      <span>{{ item.icon }}</span>
      <small>{{ item.label }}</small>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  z-index: 30;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  grid-template-columns: repeat(4, 1fr);
  min-height: calc(58px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-header) 93%, transparent);
  backdrop-filter: blur(15px);
}

.mobile-bottom-nav a {
  display: grid;
  gap: 3px;
  place-content: center;
  color: var(--text-secondary);
  text-align: center;
  text-decoration: none;
}

.mobile-bottom-nav span {
  font-size: 18px;
  line-height: 1;
}

.mobile-bottom-nav small {
  font-size: 10px;
}

.mobile-bottom-nav .is-active {
  color: var(--accent);
  font-weight: 750;
}

@media (max-width: 767px) {
  .mobile-bottom-nav {
    display: grid;
  }
}
</style>
