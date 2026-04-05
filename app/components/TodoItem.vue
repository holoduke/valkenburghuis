<script setup lang="ts">
const props = defineProps<{
  id: string
  title: string
  completed: boolean
  assignee: string
  categoryColor: string
  categoryLabel: string
  isFirst: boolean
  isLast: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  moveUp: [id: string]
  moveDown: [id: string]
  updateAssignee: [id: string, assignee: string]
}>()

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
</script>

<template>
  <div
    class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-warm-50/80"
    :class="completed ? 'opacity-60' : ''"
  >
    <!-- Move buttons -->
    <div class="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="text-warm-300 hover:text-warm-600 disabled:opacity-0 transition-colors"
        :disabled="isFirst"
        @click="emit('moveUp', id)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        class="text-warm-300 hover:text-warm-600 disabled:opacity-0 transition-colors"
        :disabled="isLast"
        @click="emit('moveDown', id)"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Checkbox -->
    <button
      class="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
      :class="completed
        ? 'bg-success-500 border-success-500'
        : 'border-warm-300 hover:border-accent-500'"
      @click="emit('toggle', id)"
    >
      <svg
        v-if="completed"
        class="w-3 h-3 text-white check-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <!-- Title -->
    <span
      class="flex-1 text-sm transition-all"
      :class="completed ? 'line-through text-warm-400' : 'text-warm-800'"
    >
      {{ title }}
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
