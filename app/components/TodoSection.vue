<script setup lang="ts">
interface Todo {
  id: string
  title: string
  category: string
  completed: boolean
  createdAt: string
}

interface Category {
  id: string
  label: string
  color: string
}

const props = defineProps<{
  todos: Todo[]
  categories: Category[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  add: [data: { title: string; category: string }]
}>()

const showForm = ref(false)
const newTitle = ref('')
const newCategory = ref('overig')
const activeFilter = ref('alle')

const filteredTodos = computed(() => {
  const sorted = [...props.todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return b.createdAt.localeCompare(a.createdAt)
  })
  if (activeFilter.value === 'alle') return sorted
  return sorted.filter((t) => t.category === activeFilter.value)
})

function getCategoryColor(categoryId: string): string {
  return props.categories.find((c) => c.id === categoryId)?.color || '#6B7280'
}

function getCategoryLabel(categoryId: string): string {
  return props.categories.find((c) => c.id === categoryId)?.label || categoryId
}

function handleAdd() {
  if (!newTitle.value.trim()) return
  emit('add', { title: newTitle.value.trim(), category: newCategory.value })
  newTitle.value = ''
  newCategory.value = 'overig'
  showForm.value = false
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-warm-800">
        Taken
        <span class="text-sm font-normal text-warm-400 ml-2">
          {{ props.todos.filter((t) => t.completed).length }}/{{ props.todos.length }}
        </span>
      </h2>
      <button
        class="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
        @click="showForm = !showForm"
      >
        {{ showForm ? 'Annuleren' : '+ Taak' }}
      </button>
    </div>

    <!-- Add form -->
    <Transition name="fade">
      <form
        v-if="showForm"
        class="mb-5 bg-white rounded-xl border border-warm-200 p-4 flex flex-col sm:flex-row gap-3"
        @submit.prevent="handleAdd"
      >
        <input
          v-model="newTitle"
          type="text"
          placeholder="Wat moet er gebeuren?"
          required
          class="flex-1 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <select
          v-model="newCategory"
          class="px-3 py-2 rounded-lg border border-warm-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        >
          <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">
            {{ cat.label }}
          </option>
        </select>
        <button
          type="submit"
          class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Toevoegen
        </button>
      </form>
    </Transition>

    <!-- Category filter -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeFilter === 'alle'
          ? 'bg-warm-800 text-white'
          : 'bg-warm-100 text-warm-600 hover:bg-warm-200'"
        @click="activeFilter = 'alle'"
      >
        Alle
      </button>
      <button
        v-for="cat in props.categories"
        :key="cat.id"
        class="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeFilter === cat.id
          ? 'text-white'
          : 'bg-warm-100 text-warm-600 hover:bg-warm-200'"
        :style="activeFilter === cat.id ? { backgroundColor: cat.color } : {}"
        @click="activeFilter = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Todo list -->
    <div
      v-if="filteredTodos.length > 0"
      class="bg-white rounded-xl border border-warm-200 divide-y divide-warm-100"
    >
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :id="todo.id"
        :title="todo.title"
        :completed="todo.completed"
        :category-color="getCategoryColor(todo.category)"
        :category-label="getCategoryLabel(todo.category)"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <div v-else class="text-center py-8 text-warm-400 text-sm">
      {{ activeFilter === 'alle' ? 'Nog geen taken. Voeg er een toe!' : 'Geen taken in deze categorie.' }}
    </div>
  </section>
</template>
