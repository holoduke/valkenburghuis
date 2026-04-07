export default defineEventHandler((event) => {
  const session = getCookie(event, 'vk_session')
  return { authenticated: session === 'authenticated' }
})
