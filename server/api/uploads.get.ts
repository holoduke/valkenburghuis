import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface UploadedFile {
  filename: string
  category: string
  url: string
}

export default defineEventHandler(async () => {
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
  const uploadsDir = join(dataDir, 'uploads')

  if (!existsSync(uploadsDir)) return []

  const categories = await readdir(uploadsDir)
  const files: UploadedFile[] = []

  for (const category of categories) {
    const catPath = join(uploadsDir, category)
    const catStat = await stat(catPath)
    if (!catStat.isDirectory()) continue

    const catFiles = await readdir(catPath)
    for (const file of catFiles) {
      files.push({
        filename: file,
        category,
        url: `/api/uploads/${category}/${file}`,
      })
    }
  }

  return files
})
