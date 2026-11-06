import type { Router } from 'vue-router'
import i18n from '@/i18n'
import { tokenStorage } from '@/services/tokenStorage'

/**
 * Настраивает navigation guards:
 * - document.title из meta.title
 * - requiresAuth: редирект на /login с ?redirect=...
 * - guestOnly: редирект на /
 * - roles: проверка роли пользователя
 */
export function setupGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    /* ── Title ── */
    const t = i18n.global.t as (key: string) => string
    const titleKey = (to.meta.title as string) || 'app.name'
    const appName = t('app.name')
    const pageTitle = t(titleKey)
    document.title = pageTitle !== appName ? `${pageTitle} — ${appName}` : appName

    /* ── Auth checks ── */
    const hasToken = tokenStorage.getAccessToken() !== null

    /* requiresAuth: гость -> /login */
    if (to.meta.requiresAuth && !hasToken) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }

    /* guestOnly: авторизованный -> / */
    if (to.meta.guestOnly && hasToken) {
      return next('/')
    }

    /* roles: проверка роли (из sessionStorage как временное решение) */
    const metaRoles = to.meta.roles as string[] | undefined
    if (metaRoles && metaRoles.length > 0 && hasToken) {
      const userRole = sessionStorage.getItem('user_role')
      if (userRole && !metaRoles.includes(userRole)) {
        return next('/')
      }
    }

    next()
  })
}
