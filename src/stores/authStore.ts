import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/authApi'
import { tokenStorage } from '@/services/tokenStorage'
import type {
  UserProfile,
  LoginCredentials,
  RegisterData,
  UserRole,
} from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => tokenStorage.getAccessToken() !== null)
  const userRole = computed<UserRole | null>(() => user.value?.role ?? null)

  function persistRole(role: UserRole | null): void {
    if (role) {
      sessionStorage.setItem('user_role', role)
    } else {
      sessionStorage.removeItem('user_role')
    }
  }

  async function fetchMe(): Promise<void> {
    try {
      console.log('[AuthStore] fetchMe()...')
      user.value = await authApi.me()
      persistRole(user.value.role)
      console.log('[AuthStore] fetchMe() OK:', user.value.email)
    } catch (e) {
      console.warn('[AuthStore] fetchMe() failed:', e)
      user.value = null
      persistRole(null)
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    console.log('[AuthStore] login() start, email:', credentials.email)
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      console.log('[AuthStore] login() API response received')
      tokenStorage.setAccessToken(response.access_token)
      tokenStorage.setRefreshToken(response.refresh_token)

      user.value = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        created_at: new Date().toISOString(),
        github_connected: false,
      }
      persistRole(response.user.role)
      console.log('[AuthStore] login() SUCCESS, user:', user.value.email)
    } catch (e) {
      console.error('[AuthStore] login() FAILED:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterData): Promise<void> {
    isLoading.value = true
    try {
      const response = await authApi.register(data)
      tokenStorage.setAccessToken(response.access_token)
      tokenStorage.setRefreshToken(response.refresh_token)

      user.value = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        created_at: new Date().toISOString(),
        github_connected: false,
      }
      persistRole(response.user.role)
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    tokenStorage.clearAll()
    user.value = null
    persistRole(null)
    try {
      const router = useRouter()
      await router.push('/login')
    } catch {
      window.location.href = '/login'
    }
  }

  async function init(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      console.log('[AuthStore] init() — no refresh token, skip')
      return
    }

    console.log('[AuthStore] init() — restoring session...')
    isLoading.value = true
    try {
      const tokens = await authApi.refresh(refreshToken)
      tokenStorage.setAccessToken(tokens.access_token)
      tokenStorage.setRefreshToken(tokens.refresh_token)
      await fetchMe()
      console.log('[AuthStore] init() — session restored')
    } catch (e) {
      console.warn('[AuthStore] init() — restore failed:', e)
      tokenStorage.clearAll()
      user.value = null
      persistRole(null)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    fetchMe,
    init,
  }
})
