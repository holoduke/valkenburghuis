import type { Todo } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const todos = await readData<Todo[]>('todos.json', [])
  const updated = todos.filter((t) => t.id !== id)

  if (updated.length === todos.length) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  await writeData('todos.json', updated)

  return { success: true }
})
