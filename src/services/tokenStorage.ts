const REFRESH_KEY = 'refresh_token'

/**
 * Хранилище токенов.
 *
 *  access  -- в памяти модуля (не переживает перезагрузку)
 *  refresh -- в sessionStorage (прототип; в prod -- HttpOnly cookie)
 */

let accessToken: string | null = null

export const tokenStorage = {
  // access
  getAccessToken(): string | null {
    return accessToken
  },

  setAccessToken(token: string): void {
    accessToken = token
  },

  clearAccessToken(): void {
    accessToken = null
  },

  // refresh
  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_KEY)
  },

  setRefreshToken(token: string): void {
    sessionStorage.setItem(REFRESH_KEY, token)
  },

  clearRefreshToken(): void {
    sessionStorage.removeItem(REFRESH_KEY)
  },

  // logout
  clearAll(): void {
    accessToken = null
    sessionStorage.removeItem(REFRESH_KEY)
  },
}
