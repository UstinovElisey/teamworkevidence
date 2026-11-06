import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title: string
    roles?: Array<'developer' | 'employer' | 'organizer' | 'customer' | 'admin'>
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
        meta: { guestOnly: true, title: 'Вход' },
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterPage,
        meta: { guestOnly: true, title: 'Регистрация' },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: { requiresAuth: true, title: 'Дашборд' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: { template: '<h2 class="text-2xl font-semibold">TODO: Профиль</h2>' },
        meta: { requiresAuth: true, title: 'Профиль' },
      },
      {
        path: 'teams',
        name: 'teams',
        component: { template: '<h2 class="text-2xl font-semibold">TODO: Команды</h2>' },
        meta: { requiresAuth: true, title: 'Команды' },
      },
      {
        path: 'marketplace',
        name: 'marketplace',
        component: { template: '<h2 class="text-2xl font-semibold">TODO: Маркетплейс</h2>' },
        meta: { requiresAuth: true, title: 'Маркетплейс' },
      },
      {
        path: 'hackathons',
        name: 'hackathons',
        component: { template: '<h2 class="text-2xl font-semibold">TODO: Хакатоны</h2>' },
        meta: { requiresAuth: true, title: 'Хакатоны' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { title: 'Не найдено' },
  },
]
