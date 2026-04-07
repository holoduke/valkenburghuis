import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data')
  const filepath = join(dataDir, 'photos', path)

  if (!existsSync(filepath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' })
  }

  const data = await readFile(filepath)
  const ext = filepath.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
  }

  setResponseHeader(event, 'Content-Type', mimeTypes[ext || ''] || 'application/octet-stream')
  return data
})
