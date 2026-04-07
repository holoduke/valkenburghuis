import type { CostsData } from '../../utils/types'

const DATA_FILE = 'photo-categories.json'

export default defineEventHandler(async () => {
  return await readData<string[]>(DATA_FILE, ['Bouwplaats', 'Interieur', 'Exterieur', 'Oplevering'])
})
