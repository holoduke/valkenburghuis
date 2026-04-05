interface CostItem {
  id: string
  label: string
  budget: number
  spent: number
}

interface CostsData {
  bouwdepot: number
  items: CostItem[]
}

export function useCosts() {
  const costs = ref<CostsData>({ bouwdepot: 0, items: [] })
  const loading = ref(false)
  const saving = ref(false)

  const totalBudget = computed(() =>
    costs.value.items.reduce((sum, item) => sum + item.budget, 0),
  )

  const totalSpent = computed(() =>
    costs.value.items.reduce((sum, item) => sum + item.spent, 0),
  )

  const remaining = computed(() =>
    costs.value.bouwdepot - totalBudget.value,
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
    saving.value = true
    try {
      costs.value = await $fetch<CostsData>('/api/costs', {
        method: 'PATCH',
        body: costs.value,
      })
    } finally {
      saving.value = false
    }
  }

  return { costs, loading, saving, totalBudget, totalSpent, remaining, fetchCosts, saveCosts }
}
