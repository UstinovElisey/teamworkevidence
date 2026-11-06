import { http, HttpResponse, delay } from 'msw'

function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

export const handlers = [
  /* ── POST /api/auth/login ── */
  http.post('/api/auth/login', async ({ request }) => {
    console.log('[MSW] POST /api/auth/login intercepted')
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const email = body.email as string
    const password = body.password as string

    console.log('[MSW] login credentials:', { email, password })

    if (email === 'test@test.com' && password === 'password123') {
      console.log('[MSW] login SUCCESS')
      return HttpResponse.json({
        access_token: 'mock-access-' + Date.now(),
        refresh_token: 'mock-refresh-' + Date.now(),
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'test@test.com',
          role: 'developer',
        },
      })
    }

    console.log('[MSW] login FAILED — invalid credentials')
    return HttpResponse.json(
      {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      },
      { status: 401 },
    )
  }),

  /* ── POST /api/auth/register ── */
  http.post('/api/auth/register', async ({ request }) => {
    console.log('[MSW] POST /api/auth/register intercepted')
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const email = body.email as string
    const role = (body.role as string) || 'developer'

    if (email === 'existing@test.com') {
      return HttpResponse.json(
        {
          error: {
            code: 'EMAIL_TAKEN',
            message: 'Email already registered',
            fields: { email: 'Email already registered' },
          },
        },
        { status: 409 },
      )
    }

    return HttpResponse.json({
      access_token: 'mock-access-' + Date.now(),
      refresh_token: 'mock-refresh-' + Date.now(),
      user: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        email,
        role,
      },
    })
  }),

  /* ── POST /api/auth/refresh ── */
  http.post('/api/auth/refresh', async ({ request }) => {
    console.log('[MSW] POST /api/auth/refresh intercepted')
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const refreshToken = body.refresh_token as string

    if (refreshToken && refreshToken.startsWith('mock-refresh-')) {
      console.log('[MSW] refresh SUCCESS')
      return HttpResponse.json({
        access_token: 'mock-access-refreshed-' + Date.now(),
        refresh_token: 'mock-refresh-new-' + Date.now(),
      })
    }

    console.log('[MSW] refresh FAILED')
    return HttpResponse.json(
      {
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token is invalid or expired',
        },
      },
      { status: 401 },
    )
  }),

  /* ── GET /api/auth/me ── */
  http.get('/api/auth/me', async ({ request }) => {
    console.log('[MSW] GET /api/auth/me intercepted')
    await delay(200)
    const token = extractToken(request.headers.get('Authorization'))

    if (token && token.startsWith('mock-access-')) {
      console.log('[MSW] me SUCCESS, token:', token.substring(0, 20) + '...')
      return HttpResponse.json({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@test.com',
        role: 'developer',
        created_at: '2024-01-15T10:30:00Z',
        github_connected: false,
      })
    }

    console.log('[MSW] me FAILED — bad token:', token)
    return HttpResponse.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired access token',
        },
      },
      { status: 401 },
    )
  }),
]
