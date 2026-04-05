interface Todo {
  id: string
  title: string
  category: string
  completed: boolean
  createdAt: string
}

export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  const completedCount = computed(() => todos.value.filter((t) => t.completed).length)
  const totalCount = computed(() => todos.value.length)

  const todosByCategory = computed(() => {
    const grouped: Record<string, Todo[]> = {}
    for (const todo of todos.value) {
      const cat = todo.category || 'overig'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(todo)
    }
    return grouped
  })

  async function fetchTodos() {
    loading.value = true
    try {
      todos.value = await $fetch<Todo[]>('/api/todos')
    } finally {
      loading.value = false
    }
  }

  async function addTodo(data: { title: string; category: string }) {
    await $fetch('/api/todos', { method: 'POST', body: data })
    await fetchTodos()
  }

  async function toggleTodo(id: string) {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return
    await $fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { completed: !todo.completed },
    })
    await fetchTodos()
  }

  async function deleteTodo(id: string) {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
  }

  return { todos, loading, completedCount, totalCount, todosByCategory, fetchTodos, addTodo, toggleTodo, deleteTodo }
}
