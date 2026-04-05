<script setup lang="ts">
interface CostItem {
  id: string
  label: string
  amount: number
}

interface CostsData {
  bouwdepot: number
  items: CostItem[]
}

const props = defineProps<{
  costs: CostsData
  totalSpent: number
  remaining: number
}>()

const emit = defineEmits<{
  'update:costs': [costs: CostsData]
}>()

const COLORS = ['#EC4899', '#8B5CF6', '#EF4444', '#A855F7', '#22C55E']

function updateBouwdepot(value: string) {
  const num = parseFloat(value) || 0
  emit('update:costs', { ...props.costs, bouwdepot: num })
}

function updateItem(index: number, value: string) {
  const num = parseFloat(value) || 0
  const newItems = props.costs.items.map((item, i) =>
    i === index ? { ...item, amount: num } : item,
  )
  emit('update:costs', { ...props.costs, items: newItems })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value)
}
</script>

<template>
  <section class="mb-10">
    <div class="mb-5">
      <h2 class="text-lg font-semibold text-warm-800">Kostenoverzicht</h2>
    </div>

    <!-- Bouwdepot summary -->
    <div class="bg-white rounded-xl border border-warm-200 p-5 mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div class="flex-1">
          <label class="text-xs font-medium text-warm-500 uppercase tracking-wide">Bouwdepot totaal</label>
          <div class="mt-1 relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">&euro;</span>
            <input
              type="number"
              :value="props.costs.bouwdepot"
              class="w-full pl-7 pr-3 py-2 rounded-lg border border-warm-200 text-lg font-semibold text-warm-800 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
              @input="updateBouwdepot(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="flex gap-6 text-sm">
          <div>
            <p class="text-warm-500">Totaal kosten</p>
            <p class="font-semibold text-warm-800">{{ formatCurrency(totalSpent) }}</p>
          </div>
          <div>
            <p class="text-warm-500">Resterend</p>
            <p
              class="font-semibold"
              :class="remaining >= 0 ? 'text-success-600' : 'text-red-500'"
            >
              {{ formatCurrency(remaining) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Depot bar -->
      <div v-if="props.costs.bouwdepot > 0" class="h-3 bg-warm-100 rounded-full overflow-hidden flex">
        <div
          v-for="(item, i) in props.costs.items"
          :key="item.id"
          class="h-full transition-all duration-500"
          :style="{
            width: `${(item.amount / props.costs.bouwdepot) * 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            opacity: item.amount > 0 ? 1 : 0,
          }"
        />
      </div>
    </div>

    <!-- Cost items grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div
        v-for="(item, i) in props.costs.items"
        :key="item.id"
        class="bg-white rounded-xl border border-warm-200 p-4"
      >
        <div class="flex items-center gap-2 mb-3">
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: COLORS[i % COLORS.length] }"
          />
          <h3 class="text-sm font-semibold text-warm-800">{{ item.label }}</h3>
        </div>

        <div class="relative">
          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-warm-400 text-xs">&euro;</span>
          <input
            type="number"
            :value="item.amount"
            class="w-full pl-6 pr-2 py-1.5 rounded-lg border border-warm-200 text-sm font-medium text-warm-800 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            @input="updateItem(i, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
