interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  completed: boolean
}

export function useTimeline() {
  const events = ref<TimelineEvent[]>([])
  const loading = ref(false)

  const sortedEvents = computed(() =>
    [...events.value].sort((a, b) => a.date.localeCompare(b.date)),
  )

  const progress = computed(() => {
    if (events.value.length === 0) return 0
    const done = events.value.filter((e) => e.completed).length
    return Math.round((done / events.value.length) * 100)
  })

  async function fetchEvents() {
    loading.value = true
    try {
      events.value = await $fetch<TimelineEvent[]>('/api/timeline')
    } finally {
      loading.value = false
    }
  }

  async function addEvent(data: { date: string; title: string; description?: string }) {
    await $fetch('/api/timeline', { method: 'POST', body: data })
    await fetchEvents()
  }

  async function toggleEvent(id: string) {
    const event = events.value.find((e) => e.id === id)
    if (!event) return
    await $fetch(`/api/timeline/${id}`, {
      method: 'PATCH',
      body: { completed: !event.completed },
    })
    await fetchEvents()
  }

  async function deleteEvent(id: string) {
    await $fetch(`/api/timeline/${id}`, { method: 'DELETE' })
    await fetchEvents()
  }

  return { events, sortedEvents, loading, progress, fetchEvents, addEvent, toggleEvent, deleteEvent }
}
