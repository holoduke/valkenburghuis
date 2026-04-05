<script setup lang="ts">
interface Todo {
  id: string
  title: string
  category: string
  assignee: string
  completed: boolean
  createdAt: string
  order: number
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
  add: [data: { title: string; category: string; assignee?: string }]
  update: [id: string, data: { title: string; category: string; assignee: string; notes: string }]
  updateAssignee: [id: string, assignee: string]
  reorder: [ids: string[]]
}>()

const showForm = ref(false)
const newTitle = ref('')
const newCategory = ref('overig')
const newAssignee = ref('')
const activeFilter = ref('alle')
const dragFromId = ref<string | null>(null)
const dragOverId = ref<string | null>(null)
const editingTodo = ref<Todo | null>(null)

const filteredTodos = computed(() => {
  const sorted = [...props.todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return (a.order ?? 0) - (b.order ?? 0)
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
  emit('add', {
    title: newTitle.value.trim(),
    category: newCategory.value,
    assignee: newAssignee.value,
  })
  newTitle.value = ''
  newCategory.value = 'overig'
  newAssignee.value = ''
  showForm.value = false
}

function onDragStart(id: string) {
  dragFromId.value = id
}

function onDragOver(id: string) {
  dragOverId.value = id
}

function onDrop() {
  if (!dragFromId.value || !dragOverId.value || dragFromId.value === dragOverId.value) {
    dragFromId.value = null
    dragOverId.value = null
    return
  }

  const uncompleted = filteredTodos.value.filter((t) => !t.completed)
  const ids = uncompleted.map((t) => t.id)
  const fromIdx = ids.indexOf(dragFromId.value)
  const toIdx = ids.indexOf(dragOverId.value)

  if (fromIdx === -1 || toIdx === -1) return

  ids.splice(fromIdx, 1)
  ids.splice(toIdx, 0, dragFromId.value)

  const completedIds = filteredTodos.value.filter((t) => t.completed).map((t) => t.id)

  if (activeFilter.value === 'alle') {
    emit('reorder', [...ids, ...completedIds])
  } else {
    // When filtered, preserve order of items not in view
    const allSorted = [...props.todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const reordered = allSorted.map((t) => t.id)
    // Remove dragged items from their positions
    const filteredIds = [...ids, ...completedIds]
    const otherIds = reordered.filter((id) => !filteredIds.includes(id))
    // Interleave: put filtered items back in their relative positions
    emit('reorder', [...ids, ...completedIds, ...otherIds])
  }

  dragFromId.value = null
  dragOverId.value = null
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
        <select
          v-model="newAssignee"
          class="px-3 py-2 rounded-lg border border-warm-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        >
          <option value="">Niemand</option>
          <option value="gillis">Gillis</option>
          <option value="ilse">Ilse</option>
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
        :assignee="todo.assignee || ''"
        :category-color="getCategoryColor(todo.category)"
        :category-label="getCategoryLabel(todo.category)"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @edit="(id: string) => editingTodo = filteredTodos.find(t => t.id === id) || null"
        @update-assignee="emit('updateAssignee', $event[0] ?? $event, $event[1] ?? '')"
        @dragstart="onDragStart"
        @dragover="onDragOver"
        @drop="onDrop"
      />
    </div>

    <div v-else class="text-center py-8 text-warm-400 text-sm">
      {{ activeFilter === 'alle' ? 'Nog geen taken. Voeg er een toe!' : 'Geen taken in deze categorie.' }}
    </div>

    <!-- Edit modal -->
    <TodoEditModal
      v-if="editingTodo"
      :todo="editingTodo"
      :categories="props.categories"
      @close="editingTodo = null"
      @save="(data) => { emit('update', editingTodo!.id, data); editingTodo = null }"
      @delete="(id) => { emit('delete', id); editingTodo = null }"
    />
  </section>
</template>
