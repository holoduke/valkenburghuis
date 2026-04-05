import type { CostsData } from '../utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CostsData>>(event)
  const current = await readData<CostsData>('costs.json', { bouwdepot: 0, items: [] })

  const updated: CostsData = {
    bouwdepot: body.bouwdepot ?? current.bouwdepot,
    items: body.items ?? current.items,
  }

  await writeData('costs.json', updated)

  return updated
})
