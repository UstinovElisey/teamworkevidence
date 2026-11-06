import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/services/tokenStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

/*
 * Эндпоинты, 401 от которых НЕ должен триггерить refresh/logout.
 * Это публичные auth-эндпоинты: сам факт 401 от них — это ожидаемая
 * ошибка валидации credentials, которую форма показывает пользователю.
 */
const AUTH_PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

function isAuthPublicPath(url: string | undefined): boolean {
  if (!url) return false
  return AUTH_PUBLIC_PATHS.some((p) => url.includes(p))
}

/* ── Request interceptor ── */
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('[API] →', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''))
  return config
})

/* ── Response error interceptor ── */
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] ←', response.status, response.config.url)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    console.log('[API] ✗', error.response?.status, originalRequest?.url, error.message)

    /* Если это не 401 или нет config — просто пробрасываем */
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    /*
     * КЛЮЧЕВОЕ: 401 от публичных auth-эндпоинтов (login/register/refresh)
     * пробрасываем наверх как есть — форма обработает и покажет ошибку.
     * Никакого refresh и никакого redirect.
     */
    if (isAuthPublicPath(originalRequest.url)) {
      console.log('[API] 401 from auth-public endpoint — pass through')
      return Promise.reject(error)
    }

    /* Защита от повторного retry */
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    /* Если refresh уже в процессе — ставим в очередь */
    if (isRefreshing) {
      return new Promise<ReturnType<typeof apiClient>>((resolve) => {
        refreshQueue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(apiClient(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
      const { data } = await axios.post<{
        access_token: string
        refresh_token: string
      }>(
        `${baseURL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      )

      tokenStorage.setAccessToken(data.access_token)
      tokenStorage.setRefreshToken(data.refresh_token)

      refreshQueue.forEach((cb) => cb(data.access_token))
      refreshQueue = []

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`
      return apiClient(originalRequest)
    } catch {
      tokenStorage.clearAll()
      sessionStorage.removeItem('user_role')
      refreshQueue = []
      /* Только если мы реально были залогинены — редиректим */
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)
