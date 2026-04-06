<script setup lang="ts">
const { sortedEvents, progress: timelineProgress, fetchEvents, addEvent, toggleEvent, deleteEvent } = useTimeline()
const { todos, completedCount, totalCount, fetchTodos, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } = useTodos()
const { costs, totalSpent, remaining, fetchCosts } = useCosts()

const categories = ref<{ id: string; label: string; color: string }[]>([])

const todoProgress = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

onMounted(async () => {
  await Promise.all([
    fetchEvents(),
    fetchTodos(),
    fetchCosts(),
    $fetch<{ id: string; label: string; color: string }[]>('/api/categories').then((data) => {
      categories.value = data
    }),
  ])
})

function handleUpdateAssignee(id: string, assignee: string) {
  updateTodo(id, { assignee })
}

function handleUpdateTodo(id: string, data: { title: string; category: string; assignee: string; notes: string; links?: { label: string; url: string }[] }) {
  updateTodo(id, data)
}
</script>

<template>
  <div class="min-h-screen font-sans">
    <AppHeader :todo-progress="todoProgress" :timeline-progress="timelineProgress" />

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-2">
      <AppTimeline
        :events="sortedEvents"
        @toggle="toggleEvent"
        @delete="deleteEvent"
        @add="addEvent"
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
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @add="addTodo"
        @update-assignee="handleUpdateAssignee"
        @update="handleUpdateTodo"
        @reorder="reorderTodos"
      />
    </main>

    <footer class="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-warm-400">
      Valkenburghuis &middot; Oplevering Tracker
    </footer>
  </div>
</template>
