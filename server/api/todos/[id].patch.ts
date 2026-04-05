import type { Todo } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<Pick<Todo, 'title' | 'category' | 'completed'>>>(event)

  const todos = await readData<Todo[]>('todos.json', [])
  const index = todos.findIndex((t) => t.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  const updated = todos.map((t, i) =>
    i === index ? { ...t, ...body } : t,
  )

  await writeData('todos.json', updated)

  return updated[index]
})
