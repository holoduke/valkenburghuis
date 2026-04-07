<script setup lang="ts">
const { sortedEvents, progress: timelineProgress, fetchEvents, setEvents, addEvent, toggleEvent, updateEvent, deleteEvent } = useTimeline()
const { todos, completedCount, totalCount, fetchTodos, setTodos, addTodo, setStatus, updateTodo, deleteTodo, reorderTodos } = useTodos()
const { costs, totalSpent, remaining, fetchCosts } = useCosts()

const categories = ref<{ id: string; label: string; color: string }[]>([])

const todoProgress = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// Smart sync: poll every 10s, only update if hash changed
const sync = useSync((data) => {
  setTodos(data.todos)
  setEvents(data.timeline)
  costs.value = data.costs
}, 10000)

// Wrap mutating actions: pause sync during writes to prevent flicker
async function withPause<T>(fn: () => Promise<T>): Promise<T> {
  sync.pause()
  try {
    const result = await fn()
    // After our write, poll once to get new hash so next poll won't re-apply stale data
    await sync.poll()
    return result
  } finally {
    sync.resume()
  }
}

onMounted(async () => {
  await Promise.all([
    fetchEvents(),
    fetchTodos(),
    fetchCosts(),
    $fetch<{ id: string; label: string; color: string }[]>('/api/categories').then((data) => {
      categories.value = data
    }),
  ])
  // Start sync after initial load, set hash so first poll doesn't duplicate
  sync.start()
})

onUnmounted(() => {
  sync.stop()
})

function handleUpdateAssignee(id: string, assignee: string) {
  withPause(() => updateTodo(id, { assignee }))
}

function handleUpdateTodo(id: string, data: { title: string; category: string; assignee: string; notes: string; status?: string; links?: { label: string; url: string }[] }) {
  withPause(() => updateTodo(id, data))
}
</script>

<template>
  <div class="min-h-screen font-sans">
    <AppHeader :todo-progress="todoProgress" :timeline-progress="timelineProgress" />

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-2">
      <AppTimeline
        :events="sortedEvents"
        @toggle="(id) => withPause(() => toggleEvent(id))"
        @delete="(id) => withPause(() => deleteEvent(id))"
        @add="(data) => withPause(() => addEvent(data))"
        @update="(id, data) => withPause(() => updateEvent(id, data))"
      />

      <CostOverview
        :costs="costs"
        :total-spent="totalSpent"
        :remaining="remaining"
        @update:costs="costs = $event"
      />

      <TodoSection
        :todos="todos"
        :categories="categories"
        @set-status="(id, s) => withPause(() => setStatus(id, s))"
        @delete="(id) => withPause(() => deleteTodo(id))"
        @add="(data) => withPause(() => addTodo(data))"
        @update-assignee="handleUpdateAssignee"
        @update="handleUpdateTodo"
        @reorder="(ids) => withPause(() => reorderTodos(ids))"
      />

      <PhotoSection />

      <DocumentSection />
    </main>

    <footer class="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-warm-400">
      Valkenburghuis &middot; Oplevering Tracker
    </footer>
  </div>
</template>
