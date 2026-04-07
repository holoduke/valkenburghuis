export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  // Public routes
  if (path.startsWith('/api/auth/') || path === '/api/health') return

  // All other API routes require auth
  if (path.startsWith('/api/')) {
    const session = getCookie(event, 'vk_session')
    if (session !== 'authenticated') {
      throw createError({ statusCode: 401, statusMessage: 'Niet ingelogd' })
    }
  }
})
