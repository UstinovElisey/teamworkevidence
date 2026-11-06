import { ref, computed, watch } from 'vue'
import { darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

const STORAGE_KEY = 'theme'

export interface UseThemeReturn {
  /** true = тёмная тема, false = светлая */
  isDark: import('vue').Ref<boolean>
  /** Переключить тему */
  toggleTheme: () => void
  /** Naive UI theme object для NConfigProvider (darkTheme или null) */
  naiveTheme: import('vue').ComputedRef<GlobalTheme | null>
}

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === null) return true
  return stored === 'dark'
}

function applyToDOM(dark: boolean): void {
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme(): UseThemeReturn {
  const isDark = ref(getInitialDark())

  applyToDOM(isDark.value)

  watch(isDark, (val) => {
    applyToDOM(val)
  })

  const toggleTheme = (): void => {
    isDark.value = !isDark.value
  }

  const naiveTheme = computed<GlobalTheme | null>(() =>
    isDark.value ? darkTheme : null,
  )

  return {
    isDark,
    toggleTheme,
    naiveTheme,
  }
}
