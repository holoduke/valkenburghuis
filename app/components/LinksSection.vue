<script setup lang="ts">
interface ExternalLink {
  id: string
  label: string
  url: string
  category: string
}

const links = ref<ExternalLink[]>([])
const loading = ref(true)
const showForm = ref(false)
const newLabel = ref('')
const newUrl = ref('')
const newCategory = ref('')

const groupedLinks = computed(() => {
  const groups: Record<string, ExternalLink[]> = {}
  for (const link of links.value) {
    const cat = link.category || 'Overig'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(link)
  }
  return groups
})

async function load() {
  loading.value = true
  try {
    links.value = await $fetch<ExternalLink[]>('/api/links')
  } finally {
    loading.value = false
  }
}

async function addLink() {
  if (!newLabel.value.trim() || !newUrl.value.trim()) return
  await $fetch('/api/links', {
    method: 'POST',
    body: {
      label: newLabel.value.trim(),
      url: newUrl.value.trim(),
      category: newCategory.value.trim() || 'Overig',
    },
  })
  newLabel.value = ''
  newUrl.value = ''
  newCategory.value = ''
  showForm.value = false
  await load()
}

async function deleteLink(id: string) {
  await $fetch(`/api/links/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(() => load())
</script>

<template>
  <section class="mb-10">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-semibold text-warm-800">Handige links</h2>
      <button
        class="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
        @click="showForm = !showForm"
      >
        {{ showForm ? 'Annuleren' : '+ Link' }}
      </button>
    </div>

    <!-- Add form -->
    <Transition name="fade">
      <form
        v-if="showForm"
        class="mb-4 bg-white rounded-xl border border-warm-200 p-4 flex flex-col sm:flex-row gap-3"
        @submit.prevent="addLink"
      >
        <input
          v-model="newLabel"
          type="text"
          placeholder="Label"
          required
          class="flex-1 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <input
          v-model="newUrl"
          type="url"
          placeholder="https://..."
          required
          class="flex-1 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <input
          v-model="newCategory"
          type="text"
          placeholder="Categorie"
          class="sm:w-40 px-3 py-2 rounded-lg border border-warm-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Toevoegen
        </button>
      </form>
    </Transition>

    <div v-if="loading" class="text-sm text-warm-400">Laden...</div>

    <div v-else-if="links.length === 0" class="text-center py-8 text-warm-400 text-sm">
      Nog geen links. Voeg er een toe!
    </div>

    <div v-else class="space-y-4">
      <div v-for="(items, category) in groupedLinks" :key="category" class="bg-white rounded-xl border border-warm-200 p-4">
        <h3 class="text-sm font-semibold text-warm-700 mb-3">{{ category }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="link in items"
            :key="link.id"
            class="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-warm-50 transition-colors"
          >
            <svg class="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <a
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="flex-1 text-sm text-warm-700 hover:text-accent-600 transition-colors truncate"
            >
              {{ link.label }}
            </a>
            <button
              class="flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 text-warm-300 hover:text-red-500 transition-all"
              @click="deleteLink(link.id)"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
