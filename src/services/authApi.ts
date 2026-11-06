import { apiClient } from '@/services/api'
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshResponse,
  UserProfile,
} from '@/types/auth'

export const authApi = {
  /** Вход по email + password */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  /** Регистрация нового пользователя */
  async register(payload: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
    return data
  },

  /** Обновление пары токенов */
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return data
  },

  /** Получение профиля текущего пользователя */
  async me(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>('/auth/me')
    return data
  },
}
