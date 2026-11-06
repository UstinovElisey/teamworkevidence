import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'

export type SupportedLocale = 'ru' | 'en'

export const SUPPORTED_LOCALES: SupportedLocale[] = ['ru', 'en']

function getInitialLocale(): SupportedLocale {
  const saved = localStorage.getItem('locale') as SupportedLocale | null
  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    return saved
  }
  return 'ru'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en },
})

export default i18n
