import type { TimelineEvent } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const events = await readData<TimelineEvent[]>('timeline.json', [])
  const updated = events.filter((e) => e.id !== id)

  if (updated.length === events.length) {
    throw createError({ statusCode: 404, statusMessage: 'Timeline event not found' })
  }

  await writeData('timeline.json', updated)

  return { success: true }
})
