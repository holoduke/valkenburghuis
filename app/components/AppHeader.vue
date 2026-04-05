<script setup lang="ts">
defineProps<{
  todoProgress: number
  timelineProgress: number
}>()
</script>

<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold text-warm-900">Valkenburghuis</h1>
          <p class="text-xs text-warm-500">Oplevering Tracker</p>
        </div>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <div class="hidden sm:flex items-center gap-2">
          <span class="text-warm-500">Tijdlijn</span>
          <div class="w-20 h-1.5 bg-warm-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-accent-500 rounded-full transition-all duration-500"
              :style="{ width: `${timelineProgress}%` }"
            />
          </div>
          <span class="text-warm-700 font-medium">{{ timelineProgress }}%</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-warm-500 hidden sm:inline">Taken</span>
          <div class="w-20 h-1.5 bg-warm-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-success-500 rounded-full transition-all duration-500"
              :style="{ width: `${todoProgress}%` }"
            />
          </div>
          <span class="text-warm-700 font-medium">{{ todoProgress }}%</span>
        </div>
      </div>
    </div>
  </header>
</template>
