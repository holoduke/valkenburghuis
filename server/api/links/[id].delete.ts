import type { ExternalLink } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const links = await readData<ExternalLink[]>('links.json', [])
  const updated = links.filter((l) => l.id !== id)

  if (updated.length === links.length) {
    throw createError({ statusCode: 404, statusMessage: 'Link not found' })
  }

  await writeData('links.json', updated)

  return { success: true }
})
