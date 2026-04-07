<script setup lang="ts">
type TodoStatus = 'todo' | 'in_progress' | 'done' | 'blocked'

const props = defineProps<{
  id: string
  title: string
  status: TodoStatus
  assignee: string
  hasLinks: boolean
  categoryColor: string
  categoryLabel: string
}>()

const emit = defineEmits<{
  cycleStatus: [id: string]
  delete: [id: string]
  edit: [id: string]
  updateAssignee: [id: string, assignee: string]
  dragstart: [id: string]
  dragover: [id: string]
  drop: []
}>()

const STATUS_CONFIG: Record<TodoStatus, { label: string; color: string; bg: string; icon: string }> = {
  todo: { label: 'Te doen', color: 'border-warm-300', bg: 'bg-white', icon: '' },
  in_progress: { label: 'Bezig', color: 'border-blue-400', bg: 'bg-blue-400', icon: 'progress' },
  done: { label: 'Klaar', color: 'border-success-500', bg: 'bg-success-500', icon: 'check' },
  blocked: { label: 'Geblokkeerd', color: 'border-red-400', bg: 'bg-red-400', icon: 'blocked' },
}

const isDone = computed(() => props.status === 'done')
const config = computed(() => STATUS_CONFIG[props.status] || STATUS_CONFIG.todo)

const ASSIGNEES = ['', 'gillis', 'ilse'] as const

function cycleAssignee() {
  const currentIdx = ASSIGNEES.indexOf(props.assignee as typeof ASSIGNEES[number])
  const nextIdx = (currentIdx + 1) % ASSIGNEES.length
  emit('updateAssignee', props.id, ASSIGNEES[nextIdx])
}

function assigneeInitial(name: string): string {
  return name ? name.charAt(0).toUpperCase() : ''
}

function assigneeColor(name: string): string {
  return name === 'gillis' ? '#3B82F6' : '#F472B6'
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.id)
  }
  emit('dragstart', props.id)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  emit('dragover', props.id)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  emit('drop')
}
</script>

<template>
  <div
    class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-warm-50/80 cursor-grab active:cursor-grabbing"
    :class="isDone ? 'opacity-50' : status === 'blocked' ? 'opacity-70' : ''"
    :draggable="!isDone"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- Drag handle -->
    <div class="flex-shrink-0 text-warm-300 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
      </svg>
    </div>

    <!-- Status button -->
    <button
      class="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
      :class="`${config.color} ${status !== 'todo' ? config.bg : 'hover:border-accent-500'}`"
      :title="config.label"
      @click="emit('cycleStatus', id)"
    >
      <!-- Check icon for done -->
      <svg v-if="status === 'done'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <!-- Arrow for in_progress -->
      <svg v-else-if="status === 'in_progress'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <!-- X for blocked -->
      <svg v-else-if="status === 'blocked'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Title -->
    <button
      class="flex-1 text-sm text-left transition-all select-none hover:text-accent-600"
      :class="isDone ? 'line-through text-warm-400' : status === 'blocked' ? 'text-warm-400' : 'text-warm-800'"
      @click="emit('edit', id)"
    >
      {{ title }}
    </button>

    <!-- Status label -->
    <span
      v-if="status === 'in_progress'"
      class="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded"
    >
      bezig
    </span>
    <span
      v-if="status === 'blocked'"
      class="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded"
    >
      geblokkeerd
    </span>

    <!-- Link icon -->
    <span v-if="hasLinks" class="flex-shrink-0 text-accent-500" title="Heeft links">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    </span>

    <!-- Assignee badge -->
    <button
      class="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all"
      :class="assignee ? 'text-white' : 'border border-dashed border-warm-300 text-warm-300 hover:border-warm-400'"
      :style="assignee ? { backgroundColor: assigneeColor(assignee) } : {}"
      :title="assignee || 'Niemand toegewezen'"
      @click="cycleAssignee"
    >
      {{ assignee ? assigneeInitial(assignee) : '?' }}
    </button>

    <!-- Category badge -->
    <span
      class="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
      :style="{ backgroundColor: categoryColor }"
    >
      {{ categoryLabel }}
    </span>

    <!-- Delete -->
    <button
      class="flex-shrink-0 opacity-0 group-hover:opacity-100 text-warm-300 hover:text-red-500 transition-all"
      @click="emit('delete', id)"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
