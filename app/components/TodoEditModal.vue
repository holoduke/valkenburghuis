<script setup lang="ts">
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
  save: [data: { title: string; category: string; assignee: string; notes: string; links: TodoLink[]; status: TodoStatus }]
  delete: [id: string]
}>()

const title = ref(props.todo.title)
const category = ref(props.todo.category)
const assignee = ref(props.todo.assignee)
const status = ref<TodoStatus>(props.todo.status || (props.todo.completed ? 'done' : 'todo'))
const notes = ref(props.todo.notes || '')
const links = ref<TodoLink[]>(props.todo.links ? [...props.todo.links] : [])
const newLinkLabel = ref('')
const newLinkUrl = ref('')

function addLink() {
  if (!newLinkLabel.value.trim() || !newLinkUrl.value.trim()) return
  links.value = [...links.value, { label: newLinkLabel.value.trim(), url: newLinkUrl.value.trim() }]
  newLinkLabel.value = ''
  newLinkUrl.value = ''
}

function removeLink(index: number) {
  links.value = links.value.filter((_, i) => i !== index)
}

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: 'todo', label: 'Te doen' },
  { value: 'in_progress', label: 'Bezig' },
  { value: 'done', label: 'Klaar' },
  { value: 'blocked', label: 'Geblokkeerd' },
]

function handleSave() {
  emit('save', {
    title: title.value.trim(),
    category: category.value,
    assignee: assignee.value,
    notes: notes.value.trim(),
    links: links.value,
    status: status.value,
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
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
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

      <div>
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Status</label>
        <div class="mt-1 flex gap-2">
          <button
            v-for="opt in STATUS_OPTIONS"
            :key="opt.value"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
            :class="status === opt.value
              ? opt.value === 'done' ? 'bg-green-500 text-white border-green-500'
                : opt.value === 'in_progress' ? 'bg-blue-500 text-white border-blue-500'
                : opt.value === 'blocked' ? 'bg-red-400 text-white border-red-400'
                : 'bg-warm-800 text-white border-warm-800'
              : 'bg-white text-warm-600 border-warm-200 hover:border-warm-400'"
            @click="status = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
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
          rows="3"
          placeholder="Voeg notities toe..."
          class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
      </div>

      <!-- Links -->
      <div>
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Links</label>
        <div v-if="links.length > 0" class="mt-1 space-y-2">
          <div
            v-for="(link, i) in links"
            :key="i"
            class="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2"
          >
            <svg class="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <a
              :href="link.url"
              target="_blank"
              class="flex-1 text-sm text-accent-600 hover:text-accent-700 underline"
            >
              {{ link.label }}
            </a>
            <button class="text-warm-300 hover:text-red-500" @click="removeLink(i)">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-2 flex gap-2">
          <input
            v-model="newLinkLabel"
            type="text"
            placeholder="Label"
            class="flex-1 px-3 py-1.5 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
          <input
            v-model="newLinkUrl"
            type="text"
            placeholder="URL"
            class="flex-1 px-3 py-1.5 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
          />
          <button
            type="button"
            class="px-3 py-1.5 bg-warm-100 text-warm-600 rounded-lg text-sm hover:bg-warm-200 transition-colors"
            @click="addLink"
          >
            +
          </button>
        </div>
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
