<script setup lang="ts">
interface Photo {
  filename: string
  category: string
  url: string
}

const categories = ref<string[]>([])
const photos = ref<Photo[]>([])
const loading = ref(true)
const uploading = ref<string | null>(null)
const activeCategory = ref('alle')
const showNewCategory = ref(false)
const newCategoryName = ref('')
const lightboxPhoto = ref<Photo | null>(null)

const filteredPhotos = computed(() => {
  if (activeCategory.value === 'alle') return photos.value
  return photos.value.filter((p) => p.category === activeCategory.value)
})

const photosByCategory = computed(() => {
  const grouped: Record<string, Photo[]> = {}
  for (const photo of filteredPhotos.value) {
    if (!grouped[photo.category]) grouped[photo.category] = []
    grouped[photo.category].push(photo)
  }
  return grouped
})

async function load() {
  loading.value = true
  try {
    const [cats, pics] = await Promise.all([
      $fetch<string[]>('/api/photos/categories'),
      $fetch<Photo[]>('/api/photos'),
    ])
    categories.value = cats
    photos.value = pics
  } finally {
    loading.value = false
  }
}

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  categories.value = await $fetch<string[]>('/api/photos/categories', {
    method: 'POST',
    body: { name: newCategoryName.value.trim() },
  })
  newCategoryName.value = ''
  showNewCategory.value = false
}

async function handleUpload(category: string, event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  uploading.value = category
  try {
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)
      await $fetch('/api/photos/upload', { method: 'POST', body: formData })
    }
    await load()
  } finally {
    uploading.value = null
    input.value = ''
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxPhoto.value) return
  if (e.key === 'Escape') lightboxPhoto.value = null
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const list = filteredPhotos.value
    const idx = list.findIndex((p) => p.url === lightboxPhoto.value?.url)
    if (idx === -1) return
    const next = e.key === 'ArrowRight' ? (idx + 1) % list.length : (idx - 1 + list.length) % list.length
    lightboxPhoto.value = list[next]
  }
}

onMounted(() => {
  load()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-warm-800">
        Foto's
        <span v-if="photos.length > 0" class="text-sm font-normal text-warm-400 ml-1">{{ photos.length }}</span>
      </h2>
      <button
        class="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
        @click="showNewCategory = !showNewCategory"
      >
        {{ showNewCategory ? 'Annuleren' : '+ Categorie' }}
      </button>
    </div>

    <!-- New category form -->
    <Transition name="fade">
      <form
        v-if="showNewCategory"
        class="mb-4 bg-white rounded-xl border border-warm-200 p-4 flex gap-3"
        @submit.prevent="addCategory"
      >
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Categorie naam"
          required
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

    <!-- Category filter -->
    <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
      <button
        class="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeCategory === 'alle' ? 'bg-warm-800 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'"
        @click="activeCategory = 'alle'"
      >
        Alle
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap"
        :class="activeCategory === cat ? 'bg-warm-800 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="text-sm text-warm-400">Laden...</div>

    <div v-else class="space-y-6">
      <!-- Per category -->
      <div v-for="cat in categories" :key="cat">
        <div v-if="activeCategory === 'alle' || activeCategory === cat">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-warm-700">{{ cat }}</h3>
            <label
              class="text-xs font-medium text-accent-500 hover:text-accent-600 cursor-pointer transition-colors"
              :class="uploading === cat ? 'opacity-50 pointer-events-none' : ''"
            >
              {{ uploading === cat ? 'Uploaden...' : '+ Foto\'s' }}
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleUpload(cat, $event)"
              />
            </label>
          </div>

          <div
            v-if="photosByCategory[cat]?.length"
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
          >
            <button
              v-for="photo in photosByCategory[cat]"
              :key="photo.url"
              class="aspect-square rounded-lg overflow-hidden bg-warm-100 hover:opacity-90 transition-opacity"
              @click="lightboxPhoto = photo"
            >
              <img
                :src="photo.url"
                :alt="photo.filename"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          </div>
          <p v-else class="text-xs text-warm-400">Nog geen foto's in deze categorie.</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightboxPhoto"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      @click.self="lightboxPhoto = null"
    >
      <button
        class="absolute top-4 right-4 text-white/70 hover:text-white"
        @click="lightboxPhoto = null"
      >
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        :src="lightboxPhoto.url"
        :alt="lightboxPhoto.filename"
        class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
      />
      <p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {{ lightboxPhoto.category }}
      </p>
    </div>
  </section>
</template>
