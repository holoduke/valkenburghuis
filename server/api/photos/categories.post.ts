const DATA_FILE = 'photo-categories.json'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string }>(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }

  const categories = await readData<string[]>(DATA_FILE, ['Bouwplaats', 'Interieur', 'Exterieur', 'Oplevering'])
  const name = body.name.trim()

  if (categories.includes(name)) {
    throw createError({ statusCode: 409, statusMessage: 'Category already exists' })
  }

  const updated = [...categories, name]
  await writeData(DATA_FILE, updated)

  return updated
})
