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
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
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

    <!-- Timeline -->
    <div
      v-if="props.events.length > 0"
      class="timeline-scroll overflow-x-auto pb-4"
    >
      <div class="relative flex items-start min-w-max px-2">
        <!-- Connecting line -->
        <div class="absolute top-[14px] left-[90px] right-[90px] h-[2px] bg-warm-200" />

        <div
          v-for="(event, i) in props.events"
          :key="event.id"
          class="relative flex flex-col items-center group"
          :style="{ width: '180px' }"
        >
          <!-- Dot -->
          <button
            class="relative z-1 w-7 h-7 rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300 cursor-pointer"
            :class="event.completed
              ? 'bg-success-500 border-success-500 shadow-sm shadow-success-500/30'
              : 'bg-white border-warm-300 hover:border-accent-500'"
            @click="emit('toggle', event.id)"
          >
            <svg
              v-if="event.completed"
              class="w-3.5 h-3.5 text-white check-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <!-- Content -->
          <div class="mt-3 text-center px-2">
            <p
              class="text-sm font-medium leading-tight transition-colors"
              :class="event.completed ? 'text-success-600' : 'text-warm-800'"
            >
              {{ event.title }}
            </p>
            <p class="text-xs text-warm-400 mt-1">{{ formatDate(event.date) }}</p>
            <p v-if="event.description" class="text-xs text-warm-400 mt-0.5">
              {{ event.description }}
            </p>
          </div>

          <!-- Delete button -->
          <button
            class="mt-2 opacity-0 group-hover:opacity-100 text-xs text-warm-400 hover:text-red-500 transition-all"
            @click="emit('delete', event.id)"
          >
            verwijder
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-warm-400 text-sm">
      Nog geen mijlpalen. Voeg er een toe om te beginnen.
    </div>
  </section>
</template>
