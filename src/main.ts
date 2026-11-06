import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/main.css'

async function bootstrap() {
  // MSW стартует ДО mount, чтобы перехватить запросы
  // из stores / composables, вызванных при инициализации
  const { initMocks } = await import('@/mocks')
  await initMocks()

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

bootstrap()
