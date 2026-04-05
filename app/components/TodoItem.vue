<script setup lang="ts">
defineProps<{
  id: string
  title: string
  completed: boolean
  categoryColor: string
  categoryLabel: string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div
    class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-warm-50/80"
    :class="completed ? 'opacity-60' : ''"
  >
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
