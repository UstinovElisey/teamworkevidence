import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { initMocks } from './mocks'
import './assets/styles/main.css'

async function bootstrap() {
  // Запуск MSW до монтирования приложения,
  // чтобы все запросы сразу перехватывались
  await initMocks()

  const app = createApp(App)

  app.use(router)
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
