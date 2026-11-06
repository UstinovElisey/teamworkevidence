/**
 * Инициализация MSW.
 * В production и при VITE_ENABLE_MSW !== 'true' -- no-op.
 */
export async function initMocks(): Promise<void> {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./browser')
    await worker.start()
  }
}
