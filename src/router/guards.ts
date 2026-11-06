import type { Router } from 'vue-router'
import i18n from '@/i18n'

export function setupGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    // TODO (задача 7): проверить токен, роли, редиректы

    const t = i18n.global.t
    const pageTitle = to.meta.title ? t(to.meta.title as string) : t('app.name')

    document.title = `${pageTitle} — ${t('app.name')}`
    next()
  })
}
