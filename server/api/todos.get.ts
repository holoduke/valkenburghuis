import type { Todo } from '../utils/types'

export default defineEventHandler(async () => {
  return await readData<Todo[]>('todos.json', [])
})
