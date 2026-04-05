import type { Todo } from '../../utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: string[] }>(event)

  if (!Array.isArray(body.ids)) {
    throw createError({ statusCode: 400, statusMessage: 'ids array is required' })
  }

  const todos = await readData<Todo[]>('todos.json', [])

  const updated = body.ids.map((id, index) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return null
    return { ...todo, order: index }
  }).filter((t): t is Todo => t !== null)

  // Add any todos not in the ids list at the end
  const missingTodos = todos
    .filter((t) => !body.ids.includes(t.id))
    .map((t, i) => ({ ...t, order: updated.length + i }))

  const final = [...updated, ...missingTodos]
  await writeData('todos.json', final)

  return final
})
