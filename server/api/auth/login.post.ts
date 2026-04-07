export default defineEventHandler(async (event) => {
  const body = await readBody<{ password: string }>(event)

  if (body.password !== 'valkenburg123') {
    throw createError({ statusCode: 401, statusMessage: 'Verkeerd wachtwoord' })
  }

  setCookie(event, 'vk_session', 'authenticated', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 dagen
    sameSite: 'lax',
  })

  return { success: true }
})
