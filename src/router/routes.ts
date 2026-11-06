import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: 'nav.dashboard' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: 'nav.profile' },
      },
      {
        path: 'teams',
        name: 'teams',
        component: () => import('@/views/TeamBuilderPage.vue'),
        meta: { title: 'nav.teams' },
      },
      {
        path: 'marketplace',
        name: 'marketplace',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: 'nav.marketplace' },
      },
      {
        path: 'hackathons',
        name: 'hackathons',
        component: () => import('@/views/HomePage.vue'),
        meta: { title: 'nav.hackathons' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/LoginPage.vue'),
        meta: { title: 'auth.login', guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/RegisterPage.vue'),
        meta: { title: 'auth.register', guestOnly: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: 'common.notFound' },
  },
]
