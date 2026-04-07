import { readdir, stat, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface Photo {
  filename: string
  category: string
  url: string
}

export default defineEventHandler(async () => {
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
  const photosDir = join(dataDir, 'photos')

  if (!existsSync(photosDir)) {
    await mkdir(photosDir, { recursive: true })
    return []
  }

  const categories = await readdir(photosDir)
  const photos: Photo[] = []

  for (const category of categories) {
    const catPath = join(photosDir, category)
    const catStat = await stat(catPath)
    if (!catStat.isDirectory()) continue

    const files = await readdir(catPath)
    for (const file of files) {
      photos.push({
        filename: file,
        category,
        url: `/api/photos/${category}/${file}`,
      })
    }
  }

  return photos
})
