interface CostItem {
  id: string
  label: string
  amount: number
}

interface CostsData {
  bouwdepot: number
  items: CostItem[]
}

export function useCosts() {
  const costs = ref<CostsData>({ bouwdepot: 0, items: [] })
  const loading = ref(false)
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  const totalSpent = computed(() =>
    costs.value.items.reduce((sum, item) => sum + item.amount, 0),
  )

  const totalBudget = totalSpent

  const remaining = computed(() =>
    costs.value.bouwdepot - totalSpent.value,
  )

  async function fetchCosts() {
    loading.value = true
    try {
      costs.value = await $fetch<CostsData>('/api/costs')
    } finally {
      loading.value = false
    }
  }

  async function saveCosts() {
    await $fetch<CostsData>('/api/costs', {
      method: 'PATCH',
      body: costs.value,
    })
  }

  function debouncedSave() {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => saveCosts(), 500)
  }

  watch(costs, () => {
    if (!loading.value) debouncedSave()
  }, { deep: true })

  return { costs, loading, totalBudget, totalSpent, remaining, fetchCosts }
}
