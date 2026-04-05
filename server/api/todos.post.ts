import { nanoid } from 'nanoid'
import type { Todo } from '../utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string; category: string }>(event)

  if (!body.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const todos = await readData<Todo[]>('todos.json', [])

  const todo: Todo = {
    id: nanoid(10),
    title: body.title.trim(),
    category: body.category || 'overig',
    completed: false,
    createdAt: new Date().toISOString(),
  }

  const updated = [...todos, todo]
  await writeData('todos.json', updated)

  return todo
})
