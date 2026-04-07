interface TodoLink {
  label: string
  url: string
}

type TodoStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

interface Todo {
  id: string
  title: string
  category: string
  assignee: string
  notes: string
  links: TodoLink[]
  status: TodoStatus
  completed: boolean
  createdAt: string
  order: number
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  const completedCount = computed(() => todos.value.filter((t) => (t.status || (t.completed ? 'done' : 'todo')) === 'done').length)
  const totalCount = computed(() => todos.value.length)

  async function fetchTodos() {
    loading.value = true
    try {
      todos.value = await $fetch<Todo[]>('/api/todos')
    } finally {
      loading.value = false
    }
  }

  async function addTodo(data: { title: string; category: string; assignee?: string }) {
    await $fetch('/api/todos', { method: 'POST', body: data })
    await fetchTodos()
  }

  async function cycleStatus(id: string) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return
    const current = todo.status || (todo.completed ? 'done' : 'todo')
    const order: TodoStatus[] = ['todo', 'in_progress', 'done', 'blocked']
    const next = order[(order.indexOf(current) + 1) % order.length]
    await $fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { status: next, completed: next === 'done' },
    })
    await fetchTodos()
  }

  async function updateTodo(id: string, data: Partial<Pick<Todo, 'assignee' | 'title' | 'category' | 'notes' | 'links' | 'status'>>) {
    await $fetch(`/api/todos/${id}`, { method: 'PATCH', body: data })
    await fetchTodos()
  }

  async function deleteTodo(id: string) {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
  }

  async function reorderTodos(ids: string[]) {
    todos.value = await $fetch<Todo[]>('/api/todos/reorder', { method: 'POST', body: { ids } })
  }

  return { todos, loading, completedCount, totalCount, fetchTodos, addTodo, cycleStatus, updateTodo, deleteTodo, reorderTodos }
}
