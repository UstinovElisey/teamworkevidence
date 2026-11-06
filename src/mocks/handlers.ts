import { http, HttpResponse, delay } from 'msw'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth'

// Дефолт ДОЛЖЕН совпадать с api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

function mockUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const handlers = [
  // ── Health check ──
  http.get(`${BASE_URL}/health`, async () => {
    await delay(200)
    return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }),

  // ── POST /auth/login ──
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    await delay(400)

    let body: LoginCredentials
    try {
      body = (await request.json()) as LoginCredentials
    } catch {
      return HttpResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
        { status: 400 },
      )
    }

    if (body.email === 'test@test.com' && body.password === 'password123') {
      const response: AuthResponse = {
        access_token: `mock-access-${Date.now()}`,
        refresh_token: `mock-refresh-${Date.now()}`,
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: body.email,
          role: 'developer',
        },
      }
      return HttpResponse.json(response, { status: 200 })
    }

    if (body.email === 'test@test.com') {
      return HttpResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 },
      )
    }

    return HttpResponse.json(
      { error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
      { status: 404 },
    )
  }),

  // ── POST /auth/register ──
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    await delay(400)

    let body: RegisterData
    try {
      body = (await request.json()) as RegisterData
    } catch {
      return HttpResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } },
        { status: 400 },
      )
    }

    if (body.email === 'exists@test.com') {
      return HttpResponse.json(
        { error: { code: 'USER_EXISTS', message: 'A user with this email already exists' } },
        { status: 409 },
      )
    }

    const response: AuthResponse = {
      access_token: `mock-access-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      user: {
        id: mockUUID(),
        email: body.email,
        role: body.role,
      },
    }
    return HttpResponse.json(response, { status: 201 })
  }),
]
