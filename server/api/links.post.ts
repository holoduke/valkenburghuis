import { nanoid } from 'nanoid'
import type { ExternalLink } from '../utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ label: string; url: string; category: string }>(event)

  if (!body.label?.trim() || !body.url?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Label and URL are required' })
  }

  const links = await readData<ExternalLink[]>('links.json', [])

  const link: ExternalLink = {
    id: nanoid(10),
    label: body.label.trim(),
    url: body.url.trim(),
    category: body.category?.trim() || 'Overig',
  }

  const updated = [...links, link]
  await writeData('links.json', updated)

  return link
})
