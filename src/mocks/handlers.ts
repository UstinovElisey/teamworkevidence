import { http, HttpResponse } from 'msw'
import type { HealthCheckResponse } from '@/types/api'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const handlers = [
  http.get(`${API_BASE}/health`, () => {
    const body: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
    return HttpResponse.json(body)
  }),
]
