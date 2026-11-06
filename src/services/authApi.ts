import apiClient from './api'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'

const AUTH_PREFIX = '/auth'

export const authApi = {
  login(data: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${AUTH_PREFIX}/login`, data).then((res) => res.data)
  },

  register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${AUTH_PREFIX}/register`, data).then((res) => res.data)
  },
}
