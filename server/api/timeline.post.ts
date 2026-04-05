import { nanoid } from 'nanoid'
import type { TimelineEvent } from '../utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ date: string; title: string; description?: string }>(event)

  if (!body.title?.trim() || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Title and date are required' })
  }

  const events = await readData<TimelineEvent[]>('timeline.json', [])

  const timelineEvent: TimelineEvent = {
    id: nanoid(10),
    date: body.date,
    title: body.title.trim(),
    description: body.description?.trim() || '',
    completed: false,
  }

  const updated = [...events, timelineEvent]
  await writeData('timeline.json', updated)

  return timelineEvent
})
