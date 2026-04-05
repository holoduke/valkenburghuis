<script setup lang="ts">
interface Todo {
  id: string
  title: string
  category: string
  assignee: string
  notes: string
  completed: boolean
}

interface Category {
  id: string
  label: string
  color: string
}

const props = defineProps<{
  todo: Todo
  categories: Category[]
}>()

const emit = defineEmits<{
  close: []
  save: [data: { title: string; category: string; assignee: string; notes: string }]
  delete: [id: string]
}>()

const title = ref(props.todo.title)
const category = ref(props.todo.category)
const assignee = ref(props.todo.assignee)
const notes = ref(props.todo.notes || '')

function handleSave() {
  emit('save', {
    title: title.value.trim(),
    category: category.value,
    assignee: assignee.value,
    notes: notes.value.trim(),
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="fixed inset-0 bg-black/40" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-warm-800">Taak bewerken</h3>
        <button class="text-warm-400 hover:text-warm-600" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div>
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Titel</label>
        <input
          v-model="title"
          type="text"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
      </div>

      <div class="flex gap-3">
        <div class="flex-1">
          <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Categorie</label>
          <select
            v-model="category"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          >
            <option v-for="cat in props.categories" :key="cat.id" :value="cat.id">
              {{ cat.label }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Toegewezen aan</label>
          <select
            v-model="assignee"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          >
            <option value="">Niemand</option>
            <option value="gillis">Gillis</option>
            <option value="ilse">Ilse</option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Notities</label>
        <textarea
          v-model="notes"
          rows="4"
          placeholder="Voeg notities toe..."
          class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
      </div>

      <div class="flex items-center justify-between pt-2">
        <button
          class="text-sm text-red-500 hover:text-red-600 font-medium"
          @click="emit('delete', props.todo.id)"
        >
          Verwijderen
        </button>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 text-sm text-warm-600 hover:bg-warm-100 rounded-lg transition-colors"
            @click="emit('close')"
          >
            Annuleren
          </button>
          <button
            class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
            @click="handleSave"
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
