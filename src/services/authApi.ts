import apiClient from './api'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'

const AUTH_PREFIX = '/auth'

export const authApi = {
  async login(data: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/login`, data)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${AUTH_PREFIX}/register`, data)
    return response.data
  },
}
