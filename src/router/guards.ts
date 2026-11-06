import type { Router } from 'vue-router'

const APP_TITLE = 'TeamWorkEvidence'

export function setupGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    // TODO (задача 7): проверить токен из auth store,
    // обработать requiresAuth / guestOnly / roles,
    // редиректить на /login или / при необходимости.
    document.title = to.meta?.title
      ? `${to.meta.title} — ${APP_TITLE}`
      : APP_TITLE
    next()
  })
}
