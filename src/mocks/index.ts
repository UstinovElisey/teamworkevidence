export async function initMocks(): Promise<void> {
  const { worker } = await import('./browser')
  await worker.start()
  console.log('[MSW] Mock Service Worker started successfully')
}
