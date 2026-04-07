<script setup lang="ts">
interface Doc {
  name: string
  url: string
  uploaded?: boolean
}

interface DocGroup {
  id: string
  title: string
  docs: Doc[]
}

const groups = ref<DocGroup[]>([])
const loading = ref(true)
const uploading = ref<string | null>(null)

function classifyFile(file: string): string {
  const lower = file.toLowerCase()
  if (lower.includes('planning')) return 'planning'
  if (lower.includes('schilder') || lower.includes('alphapaint') || lower.includes('gouwe') || lower.includes('mnr') || lower.includes('bouwsector')) return 'schilderwerk'
  if (lower.includes('vloer') || lower.includes('giet') || lower.includes('floor') || lower.includes('hollandse') || lower.includes('vepox') || lower.includes('creafloors') || lower.includes('grijs') || lower.includes('smit') || lower.includes('nextlevel') || lower.includes('uniek')) return 'gietvloeren'
  return 'overig'
}

function cleanName(file: string): string {
  return file
    .replace('.pdf', '')
    .replace(/^[a-zA-Z0-9]{6}-/, '')
    .replace(/-/g, ' ')
}

async function loadDocs() {
  loading.value = true
  try {
    const [staticFiles, uploadedFiles] = await Promise.all([
      $fetch<string[]>('/api/docs'),
      $fetch<{ filename: string; category: string; url: string }[]>('/api/uploads'),
    ])

    const grouped: Record<string, Doc[]> = {
      planning: [],
      schilderwerk: [],
      gietvloeren: [],
      overig: [],
    }

    for (const file of staticFiles) {
      const cat = classifyFile(file)
      grouped[cat].push({
        name: cleanName(file),
        url: `/docs/${file}`,
      })
    }

    for (const file of uploadedFiles) {
      const cat = file.category in grouped ? file.category : 'overig'
      grouped[cat].push({
        name: cleanName(file.filename),
        url: file.url,
        uploaded: true,
      })
    }

    const order: { id: string; title: string }[] = [
      { id: 'planning', title: 'Planning' },
      { id: 'schilderwerk', title: 'Offertes Schilderwerk' },
      { id: 'gietvloeren', title: 'Offertes Gietvloeren' },
      { id: 'overig', title: 'Overige documenten' },
    ]

    groups.value = order
      .filter((g) => grouped[g.id].length > 0 || g.id === 'overig')
      .map((g) => ({ ...g, docs: grouped[g.id] }))
  } finally {
    loading.value = false
  }
}

async function handleUpload(categoryId: string, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = categoryId
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', categoryId)

    await $fetch('/api/upload', { method: 'POST', body: formData })
    await loadDocs()
  } finally {
    uploading.value = null
    input.value = ''
  }
}

onMounted(() => loadDocs())
</script>

<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-warm-800 mb-5">Documenten</h2>

    <div v-if="loading" class="text-sm text-warm-400">Laden...</div>

    <div v-else class="space-y-4">
      <div v-for="group in groups" :key="group.id" class="bg-white rounded-xl border border-warm-200 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-warm-700">{{ group.title }}</h3>
          <label
            class="text-xs font-medium text-accent-500 hover:text-accent-600 cursor-pointer transition-colors"
            :class="uploading === group.id ? 'opacity-50 pointer-events-none' : ''"
          >
            {{ uploading === group.id ? 'Uploaden...' : '+ Upload' }}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
              class="hidden"
              @change="handleUpload(group.id, $event)"
            />
          </label>
        </div>

        <div v-if="group.docs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            v-for="doc in group.docs"
            :key="doc.url"
            :href="doc.url"
            target="_blank"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-warm-50 transition-colors group"
          >
            <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v7h6v9H6z" />
            </svg>
            <span class="text-sm text-warm-700 group-hover:text-accent-600 transition-colors truncate">
              {{ doc.name }}
            </span>
          </a>
        </div>
        <p v-else class="text-xs text-warm-400">Nog geen documenten.</p>
      </div>
    </div>
  </section>
</template>
