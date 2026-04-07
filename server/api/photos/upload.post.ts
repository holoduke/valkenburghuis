import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  if (!form || form.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const fileField = form.find((f) => f.name === 'file')
  const categoryField = form.find((f) => f.name === 'category')

  if (!fileField || !fileField.data || !fileField.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No file in upload' })
  }

  const category = categoryField?.data?.toString() || 'algemeen'
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
  const photosDir = join(dataDir, 'photos', category)
  await mkdir(photosDir, { recursive: true })

  const safeName = fileField.filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
  const filename = `${nanoid(6)}-${safeName}`
  const filepath = join(photosDir, filename)

  await writeFile(filepath, fileField.data)

  return {
    filename,
    category,
    url: `/api/photos/${category}/${filename}`,
  }
})
