<script setup lang="ts">
interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

const props = defineProps<{
  events: TimelineEvent[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  add: [data: { date: string; title: string; description?: string }]
}>()

const showForm = ref(false)
const newTitle = ref('')
const newDate = ref('')
const newDescription = ref('')

function handleAdd() {
  if (!newTitle.value.trim() || !newDate.value) return
  emit('add', {
    title: newTitle.value.trim(),
    date: newDate.value,
    description: newDescription.value.trim() || undefined,
  })
  newTitle.value = ''
  newDate.value = ''
  newDescription.value = ''
  showForm.value = false
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

const today = new Date().toISOString().slice(0, 10)

function isPast(dateStr: string): boolean {
  return dateStr < today
}

function isClosest(i: number): boolean {
  let minDiff = Infinity
  let idx = 0
  for (let j = 0; j < props.events.length; j++) {
    const diff = Math.abs(new Date(props.events[j].date).getTime() - new Date(today).getTime())
    if (diff < minDiff) {
      minDiff = diff
      idx = j
    }
  }
  return i === idx
}
</script>

<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-warm-800">Tijdlijn</h2>
      <button
        class="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
        @click="showForm = !showForm"
      >
        {{ showForm ? 'Annuleren' : '+ Mijlpaal' }}
      </button>
    </div>

    <!-- Add form -->
    <Transition name="fade">
      <form
        v-if="showForm"
        class="mb-6 bg-white rounded-xl border border-warm-200 p-4 flex flex-col sm:flex-row gap-3"
        @submit.prevent="handleAdd"
      >
        <input
          v-model="newTitle"
          type="text"
          placeholder="Mijlpaal titel"
          required
          class="flex-1 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <input
          v-model="newDate"
          type="date"
          required
          class="px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <input
          v-model="newDescription"
          type="text"
          placeholder="Beschrijving (optioneel)"
          class="flex-1 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Toevoegen
        </button>
      </form>
    </Transition>

    <!-- Timeline list -->
    <div v-if="props.events.length > 0" class="bg-white rounded-xl border border-warm-200 divide-y divide-warm-100">
      <div
        v-for="(event, i) in props.events"
        :key="event.id"
        class="group flex items-center gap-3 px-4 py-3 transition-all"
        :class="isClosest(i) ? 'bg-accent-500/5' : 'hover:bg-warm-50/80'"
      >
        <!-- Checkbox -->
        <button
          class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          :class="event.completed
            ? 'bg-success-500 border-success-500'
            : isClosest(i)
              ? 'border-accent-500'
              : 'border-warm-300 hover:border-accent-500'"
          @click="emit('toggle', event.id)"
        >
          <svg
            v-if="event.completed"
            class="w-3 h-3 text-white check-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <div v-else-if="isClosest(i)" class="w-1.5 h-1.5 bg-accent-500 rounded-full" />
        </button>

        <!-- Date -->
        <span
          class="flex-shrink-0 w-16 text-xs font-medium"
          :class="event.completed ? 'text-warm-400' : isClosest(i) ? 'text-accent-600' : isPast(event.date) ? 'text-warm-400' : 'text-warm-500'"
        >
          {{ formatDate(event.date) }}
        </span>

        <!-- Title & description -->
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium truncate"
            :class="event.completed ? 'line-through text-warm-400' : isClosest(i) ? 'text-accent-700' : 'text-warm-800'"
          >
            {{ event.title }}
          </p>
          <p v-if="event.description" class="text-xs text-warm-400 truncate">
            {{ event.description }}
          </p>
        </div>

        <!-- Now indicator -->
        <span
          v-if="isClosest(i) && !event.completed"
          class="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-accent-500 bg-accent-500/10 px-2 py-0.5 rounded-full"
        >
          nu
        </span>

        <!-- Delete -->
        <button
          class="flex-shrink-0 opacity-0 group-hover:opacity-100 text-warm-300 hover:text-red-500 transition-all"
          @click="emit('delete', event.id)"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8 text-warm-400 text-sm">
      Nog geen mijlpalen. Voeg er een toe om te beginnen.
    </div>
  </section>
</template>
