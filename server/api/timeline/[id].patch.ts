import type { TimelineEvent } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<Pick<TimelineEvent, 'title' | 'date' | 'description' | 'completed'>>>(event)

  const events = await readData<TimelineEvent[]>('timeline.json', [])
  const index = events.findIndex((e) => e.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Timeline event not found' })
  }

  const updated = events.map((e, i) =>
    i === index ? { ...e, ...body } : e,
  )

  await writeData('timeline.json', updated)

  return updated[index]
})
