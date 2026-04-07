<script setup lang="ts">
interface DocGroup {
  title: string
  docs: { name: string; url: string }[]
}

const groups = ref<DocGroup[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const files = await $fetch<string[]>('/api/docs')
    const schilders: { name: string; url: string }[] = []
    const gietvloeren: { name: string; url: string }[] = []
    const overig: { name: string; url: string }[] = []

    for (const file of files) {
      const label = file.replace('.pdf', '').replace(/-/g, ' ').replace('Offerte ', '')
      const entry = { name: label, url: `/docs/${file}` }

      const lower = file.toLowerCase()
      if (lower.includes('schilder') || lower.includes('alphapaint') || lower.includes('gouwe') || lower.includes('mnr') || lower.includes('bouwsector')) {
        schilders.push(entry)
      } else if (lower.includes('vloer') || lower.includes('giet') || lower.includes('floor') || lower.includes('hollandse') || lower.includes('vepox') || lower.includes('creafloors') || lower.includes('grijs') || lower.includes('smit') || lower.includes('nextlevel') || lower.includes('uniek')) {
        gietvloeren.push(entry)
      } else {
        overig.push(entry)
      }
    }

    const result: DocGroup[] = []
    if (overig.length > 0 || files.includes('planning-aannemer.pdf')) {
      result.push({
        title: 'Planning',
        docs: [{ name: 'Planning aannemer (Duijn Bouw)', url: '/docs/planning-aannemer.pdf' }],
      })
    }
    if (schilders.length > 0) result.push({ title: 'Offertes Schilderwerk', docs: schilders })
    if (gietvloeren.length > 0) result.push({ title: 'Offertes Gietvloeren', docs: gietvloeren })

    groups.value = result
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="mb-10">
    <h2 class="text-lg font-semibold text-warm-800 mb-5">Documenten</h2>

    <div v-if="loading" class="text-sm text-warm-400">Laden...</div>

    <div v-else class="space-y-4">
      <div v-for="group in groups" :key="group.title" class="bg-white rounded-xl border border-warm-200 p-4">
        <h3 class="text-sm font-semibold text-warm-700 mb-3">{{ group.title }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      </div>
    </div>
  </section>
</template>
