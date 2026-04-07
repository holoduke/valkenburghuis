import type { Todo, TimelineEvent, CostsData } from '../utils/types'
import { createHash } from 'crypto'

export default defineEventHandler(async () => {
  const [todos, timeline, costs] = await Promise.all([
    readData<Todo[]>('todos.json', []),
    readData<TimelineEvent[]>('timeline.json', []),
    readData<CostsData>('costs.json', { bouwdepot: 0, items: [] }),
  ])

  const raw = JSON.stringify({ todos, timeline, costs })
  const hash = createHash('md5').update(raw).digest('hex').slice(0, 12)

  return { hash, todos, timeline, costs }
})
