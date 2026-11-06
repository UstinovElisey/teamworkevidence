import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/authStore'
import './assets/styles/main.css'

async function initMocks(): Promise<void> {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    console.log('[Boot] VITE_ENABLE_MOCKS=true, starting MSW...')
    const { initMocks: startMocks } = await import('./mocks')
    await startMocks()
  } else {
    console.log('[Boot] VITE_ENABLE_MOCKS is not "true", skipping MSW')
    console.log('[Boot] env value:', JSON.stringify(import.meta.env.VITE_ENABLE_MOCKS))
  }
}

async function bootstrap(): Promise<void> {
  console.log('[Boot] starting...')
  await initMocks()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(i18n)

  const authStore = useAuthStore(pinia)
  await authStore.init()

  console.log('[Boot] mounting app')
  app.mount('#app')
}

bootstrap()
