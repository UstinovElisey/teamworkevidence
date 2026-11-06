import { ref, watch } from 'vue'

const STORAGE_KEY = 'app_theme'

/* Инициализация из localStorage, по умолчанию — dark */
function loadTheme(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light') return false
  if (stored === 'dark') return true
  return true /* default dark */
}

const isDark = ref<boolean>(loadTheme())

watch(isDark, (val) => {
  localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
})

export function useTheme() {
  function toggleTheme(): void {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme,
  }
}
