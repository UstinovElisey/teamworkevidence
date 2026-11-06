import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
 * Временный UI-store для навигации по sidebar пока
 * реальные роуты (reports/team/settings) не реализованы.
 * В следующих задачах будет заменён на vue-router.
 */
export const useUiStore = defineStore('ui', () => {
  const activeSection = ref<string>('home')

  function setActiveSection(key: string): void {
    activeSection.value = key
  }

  return {
    activeSection,
    setActiveSection,
  }
})
