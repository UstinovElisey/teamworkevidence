/** Роли пользователей (по ТЗ) */
export type UserRole = 'developer' | 'employer' | 'organizer' | 'customer'

/** Данные для входа */
export interface LoginCredentials {
  email: string
  password: string
}

/** Данные для регистрации */
export interface RegisterData {
  email: string
  password: string
  role: UserRole
}

/** Краткая информация о пользователе (в ответе auth) */
export interface UserSummary {
  id: string
  email: string
  role: UserRole
}

/** Ответ auth-эндпоинтов */
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: UserSummary
}
