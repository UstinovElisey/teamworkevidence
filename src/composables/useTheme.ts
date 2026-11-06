import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

const isDark = ref(localStorage.getItem('theme') !== 'light')

export function useTheme() {
  const theme = computed<GlobalTheme | null>(() => (isDark.value ? darkTheme : null))

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, theme, toggleTheme }
}
