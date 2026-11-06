/** Стандартный пагинированный ответ API */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

/** Структура ошибки API */
export interface ApiErrorPayload {
  error: {
    code: string
    message: string
  }
}

/** Ответ health-check */
export interface HealthCheckResponse {
  status: 'ok'
  timestamp: string
}

/** Параметры пагинации для запросов */
export interface PaginationParams {
  page?: number
  limit?: number
}
