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
  setStatus: [id: string, status: TodoStatus]
  delete: [id: string]
  edit: [id: string]
  updateAssignee: [id: string, assignee: string]
  dragstart: [id: string]
  dragover: [id: string]
  drop: []
}>()

const showStatusPicker = ref(false)

const STATUS_OPTIONS: { value: TodoStatus; label: string; color: string; bg: string }[] = [
  { value: 'todo', label: 'Te doen', color: 'text-warm-500', bg: 'hover:bg-warm-50' },
  { value: 'in_progress', label: 'Bezig', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
  { value: 'done', label: 'Klaar', color: 'text-green-600', bg: 'hover:bg-green-50' },
  { value: 'blocked', label: 'Geblokkeerd', color: 'text-red-500', bg: 'hover:bg-red-50' },
]

const STATUS_ICON: Record<TodoStatus, { border: string; bg: string }> = {
  todo: { border: 'border-warm-300', bg: '' },
  in_progress: { border: 'border-blue-400', bg: 'bg-blue-400' },
  done: { border: 'border-green-500', bg: 'bg-green-500' },
  blocked: { border: 'border-red-400', bg: 'bg-red-400' },
}

const isDone = computed(() => props.status === 'done')
const iconStyle = computed(() => STATUS_ICON[props.status] || STATUS_ICON.todo)

const ASSIGNEES = ['', 'gillis', 'ilse'] as const

function cycleAssignee() {
  const currentIdx = ASSIGNEES.indexOf(props.assignee as typeof ASSIGNEES[number])
  const nextIdx = (currentIdx + 1) % ASSIGNEES.length
  emit('updateAssignee', props.id, ASSIGNEES[nextIdx])
}

function selectStatus(s: TodoStatus) {
  showStatusPicker.value = false
  if (s !== props.status) emit('setStatus', props.id, s)
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

// Close picker when clicking outside
function onClickOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('.status-picker-wrapper')
  if (!el) showStatusPicker.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside, true))
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
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
    <!-- Drag handle (desktop only) -->
    <div class="hidden sm:block flex-shrink-0 text-warm-300 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
      </svg>
    </div>

    <!-- Status button with popover -->
    <div class="relative status-picker-wrapper flex-shrink-0">
      <button
        class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200"
        :class="`${iconStyle.border} ${status !== 'todo' ? iconStyle.bg : 'hover:border-accent-500'}`"
        @click.stop="showStatusPicker = !showStatusPicker"
      >
        <svg v-if="status === 'done'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="status === 'in_progress'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <svg v-else-if="status === 'blocked'" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </button>

      <!-- Status picker popover -->
      <Transition name="fade">
        <div
          v-if="showStatusPicker"
          class="absolute left-0 top-full mt-1 z-20 bg-white rounded-xl border border-warm-200 shadow-lg py-1 w-40"
        >
          <button
            v-for="opt in STATUS_OPTIONS"
            :key="opt.value"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors"
            :class="[opt.bg, opt.color, props.status === opt.value ? 'font-semibold' : '']"
            @click.stop="selectStatus(opt.value)"
          >
            <!-- Mini status icon -->
            <span
              class="w-3.5 h-3.5 rounded flex items-center justify-center border-2"
              :class="STATUS_ICON[opt.value].border + ' ' + (opt.value !== 'todo' ? STATUS_ICON[opt.value].bg : '')"
            >
              <svg v-if="opt.value === 'done'" class="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="opt.value === 'in_progress'" class="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <svg v-else-if="opt.value === 'blocked'" class="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6" />
              </svg>
            </span>
            {{ opt.label }}
            <!-- Current indicator -->
            <svg v-if="props.status === opt.value" class="w-3.5 h-3.5 ml-auto text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </Transition>
    </div>

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

    <!-- Category dot (mobile) / badge (desktop) -->
    <span
      class="sm:hidden flex-shrink-0 w-2.5 h-2.5 rounded-full"
      :style="{ backgroundColor: categoryColor }"
      :title="categoryLabel"
    />
    <span
      class="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
      :style="{ backgroundColor: categoryColor }"
    >
      {{ categoryLabel }}
    </span>
  </div>
</template>
