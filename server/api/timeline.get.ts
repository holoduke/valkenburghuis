import type { TimelineEvent } from '../utils/types'

export default defineEventHandler(async () => {
  return await readData<TimelineEvent[]>('timeline.json', [])
})
