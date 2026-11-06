import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from './tokenStorage'
import type { ApiErrorPayload } from '@/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
})

// Request: attach Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response: normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      // TODO (задача 7): попытка refresh + повтор запроса
      // Пока просто пробрасываем ошибку дальше
    }

    // Нормализация: если бэкенд не вернул стандартный формат,
    // оборачиваем в ApiErrorPayload
    if (error.response && !error.response.data?.error) {
      ;(error.response.data as ApiErrorPayload) = {
        error: {
          code: String(error.response.status),
          message: error.message,
        },
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
