import type { CostsData } from '../utils/types'

const defaultCosts: CostsData = {
  bouwdepot: 0,
  items: [
    { id: 'keuken', label: 'Keuken', budget: 0, spent: 0 },
    { id: 'vloer', label: 'Vloer', budget: 0, spent: 0 },
    { id: 'schilderen', label: 'Schilderwerk', budget: 0, spent: 0 },
    { id: 'inbouwkasten', label: 'Inbouwkasten', budget: 0, spent: 0 },
    { id: 'tuin', label: 'Tuin', budget: 0, spent: 0 },
  ],
}

export default defineEventHandler(async () => {
  return await readData<CostsData>('costs.json', defaultCosts)
})
