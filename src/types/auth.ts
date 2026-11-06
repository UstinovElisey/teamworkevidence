/** Роли пользователей */
export type UserRole = 'developer' | 'teamlead' | 'manager' | 'admin'

/** Данные для входа */
export interface LoginCredentials {
  email: string
  password: string
}

/** Данные для регистрации */
export interface RegisterData {
  email: string
  password: string
  password_confirmation: string
  role: UserRole
}

/** Краткий профиль пользователя (приходит при login/register) */
export interface UserSummary {
  id: string
  email: string
  role: UserRole
}

/** Ответ login / register */
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: UserSummary
}

/** Ответ refresh-эндпоинта (только новые токены, без user) */
export interface RefreshResponse {
  access_token: string
  refresh_token: string
}

/** Расширенный профиль пользователя (GET /auth/me) */
export interface UserProfile extends UserSummary {
  created_at: string
  github_connected: boolean
}
