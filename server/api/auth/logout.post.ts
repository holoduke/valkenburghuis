export default defineEventHandler((event) => {
  deleteCookie(event, 'vk_session', { path: '/' })
  return { success: true }
})
