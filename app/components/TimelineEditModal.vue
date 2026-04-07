<script setup lang="ts">
interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

const props = defineProps<{
  event: TimelineEvent
}>()

const emit = defineEmits<{
  close: []
  save: [data: { title: string; date: string; description: string }]
  toggle: [id: string]
  delete: [id: string]
}>()

const title = ref(props.event.title)
const date = ref(props.event.date)
const description = ref(props.event.description || '')

function handleSave() {
  if (!title.value.trim() || !date.value) return
  emit('save', {
    title: title.value.trim(),
    date: date.value,
    description: description.value.trim(),
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-black/40" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-warm-800">Mijlpaal bewerken</h3>
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
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Datum</label>
        <input
          v-model="date"
          type="date"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Beschrijving</label>
        <textarea
          v-model="description"
          rows="2"
          placeholder="Optioneel..."
          class="mt-1 w-full px-3 py-2 rounded-lg border border-warm-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
      </div>

      <!-- Status -->
      <div class="flex items-center gap-2">
        <button
          class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          :class="props.event.completed ? 'bg-success-500 border-success-500' : 'border-warm-300'"
          @click="emit('toggle', props.event.id)"
        >
          <svg v-if="props.event.completed" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <span class="text-sm text-warm-600">{{ props.event.completed ? 'Afgerond' : 'Nog niet afgerond' }}</span>
      </div>

      <div class="flex items-center justify-between pt-2">
        <button
          class="text-sm text-red-500 hover:text-red-600 font-medium"
          @click="emit('delete', props.event.id)"
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
